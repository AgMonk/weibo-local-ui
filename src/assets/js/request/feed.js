import {wbGetRequest} from "@/assets/js/request/request";
import {copyField, distinctById} from "@/assets/js/utils/ObjUtils";

const getTimelinePrefix = (type) => {
    switch (type) {
        case 20:
            return 'friends';
        case 0:
            return 'groups';
        case 1:
            return 'unreadfriends';
    }
}


export const getAllGroups = () => {
    return wbGetRequest({
        url: '/feed/allGroups',
        params: {
            is_new_segment: 1,
            fetch_hot: 1,
        }
    }).then(res => {
        // console.log(res.groups)
        return res.groups
    }).then(res => res.map(group => {
        const {title, group_type, priority} = group
        const data = group.group.map(item => ({
            gid: Number(item.gid),
            // uid: Number(item.uid),
            type: Number(item.type),
            prefix: getTimelinePrefix(Number(item.type)),
            sysGroup: Number(item.sysgroup),
            title: item.title,
            isUnread: item.is_unread
        }))

        return {title, type: group_type, priority, data}
    }))
}

export const getTimeline = ({listId, fid, count = 10, sinceId, maxId, refresh = 4, type}) => {
    return wbGetRequest({
        url: `/feed/${type}timeline`,
        params: {
            list_id: listId,
            since_id: sinceId,
            max_id: maxId,
            fid: fid,
            count, refresh,
        }
    }).then(res => {
        const {max_id, since_id, statuses} = res
        console.log(statuses)
        return {
            maxId: max_id, sinceId: since_id, ...parseStatues(statuses)
        }
    })
}

export const parseStatues = (statuses) => {
    const data = statuses.map(item => parse(item))
    const contents = data.map(i => i.content)
    let authors = data.map(i => i.author)

    const retweeted = contents.filter(i => i.retweeted).map(i => i.retweeted)
    const retweetedAuthors = retweeted.map(i => i.author)
    const retweetedContents = retweeted.map(i => i.content)
    authors.push(...retweetedAuthors)
    authors = distinctById(authors)
    contents.filter(i => i.retweeted).forEach(item => item.retweeted = item.retweeted.content.id)
    return {contents, authors, retweeted: retweetedContents};
}

//解析单条状态数据
const parse = (item) => {
    const {
        created_at,
        id,
        isLongText,
        mblogid,
        mblogtype,
        mlevel,
        edit_count,
        pic_focus_point,
        pic_infos,
        pic_num,
        source,
        textLength,
        text_raw, text,
        url_struct,
        visible,
        page_info,
        user,
        retweeted_status,
        reposts_count,
        attitudes_count,
        comments_count,
        attitudes_status,
    } = item

    //数量
    const counts = {
        reposts: reposts_count,
        attitudes: attitudes_count,
        comments: comments_count,
        attitudesStatus: attitudes_status,
        editCount: edit_count,
    }

    //todo 意义未明
    const blog = {
        uuid: mblogid,
        type: mblogtype,
        level: mlevel,
    }

    //todo
    const pictures = !pic_infos ? [] : Object.keys(pic_infos).map(i => pic_infos[i]).map(item => {
        const {thumbnail, bmiddle, large, original, largest, mw2000, focus_point, object_id, pic_id, photo_tag, type, pic_status} = item
        const urlFields = ['url', 'height', 'width']
        const urls = {
            thumbnail: copyField(thumbnail, urlFields),
            bmiddle: copyField(bmiddle, urlFields),
            large: copyField(large, urlFields),
            original: copyField(original, urlFields),
            largest: copyField(largest, urlFields),
            mw2000: copyField(mw2000, urlFields),

        }
        return {
            id: pic_id,
            type, status: pic_status,
            urls,
        }
    })

    const timestamp = {
        create: new Date(created_at).toObj()
    }


    const content = {
        //todo
        // visible,

        isLongText: isLongText && text.includes('...<span class="expand">展开</span>'),
        text: text_raw.split('\n'),
        textHtml: text_raw.split('\n').map(t => parseText(t)),
        length: textLength,
        timestamp,
        source,
        counts,
        blog,
        pictures,
        id,
        authorId: user ? user.id : 0,
    }
    //作者
    const author = user ? {
        id: user ? user.id : 0,
        name: user ? user.screen_name : '',
        avatars: {
            small: user.profile_image_url,
            large: user.avatar_large,
            hd: user.avatar_hd,
        },
        followMe: user.follow_me,
        following: user.following,
        rank: user.mbrank,
        type: user.mbtype,
        iconList: user.icon_list,
    } : {}

    if (retweeted_status) {
        content.retweeted = parse(retweeted_status)
    }

    if (page_info) {
        const {page_id, object_type, page_pic, author_id, content1, content2, content3, content4, type_icon, object_id, media_info, pic_info} = page_info
        const info = {
            type: object_type,
            id: page_id,
            backgroundImage: page_pic ? replaceImageUrl(page_pic) : undefined,
            typeIcon: type_icon,
            authorId: author_id,
            objectId: object_id,
            content: [content1, content2, content3, content4]
        };
        if (media_info) {
            info.urls = {
                stream: media_info.stream_url,
                streamHd: media_info.stream_url_hd,
                mp4Sd: media_info.mp4_sd_url,
                mp4Hd: media_info.mp4_hd_url,
                h5: media_info.h5_url,
                mp4_720p: media_info.mp4_720p_mp4,
            }
        }
        if (pic_info) {
            info.picInfo = {}
            Object.keys(pic_info).forEach(key => {
                const {height, url, width} = pic_info[key]
                info.picInfo[key] = {
                    url: replaceImageUrl(url),
                    height: Number(height) + 'px',
                    width: Number(width) + 'px',
                }
            })
        }
        if (content.retweeted) {
            content.retweeted.content.pageInfo = info
        } else {
            content.pageInfo = info
        }
    }

    return {content, author,}
}


export const replaceImageUrl = (url) => url.replace('https:/', '').replace('http:/', '').replace('.sinaimg.cn', '');

export const parseText = (text) => {
    let t = text;
    let res;
    const topicPattern = /#(.+?)#/g
    while (res = topicPattern.exec(text)) {
        const m = res[0]
        const text = res[1]
        if (text.includes('[超话]')) {
            t = t.replace(m, `<a href="https://huati.weibo.com/k/${text.replace('[超话]', '')}" target="_blank" style="color:orange">${text}</a>`)
        } else {
            t = t.replace(m, `<a href="https://s.weibo.com/weibo?q=%23${text}%23" target="_blank" style="color:orange">${m}</a>`)
        }
    }

    const atPattern = /@(.+?)[:,\s]/g
    while (res = atPattern.exec(text)) {
        const m = res[1]
        t = t.replace(`@${m}`, `<a href="https://weibo.com/n/${m}" target="_blank" style="color:orange">@${m}</a>`)
    }
    const atPattern2 = /@([^>]+?)$/g
    while (res = atPattern2.exec(t)) {
        const m = res[1]
        t = t.replace(`@${m}`, `<a href="https://weibo.com/n/${m}" target="_blank" style="color:orange">@${m}</a>`)
    }

    const twiName = /twi[:,：](.+)\s/g
    while (res = twiName.exec(t)) {
        const m = res[1]
        t = t.replace(res[0], `<a href="https://twitter.com/${m}" target="_blank" style="color:orange">推特：${m}</a>`)
    }
    return t
}