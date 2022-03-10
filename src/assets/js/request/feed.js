import {wbGetRequest} from "@/assets/js/request/request";
import {distinctById} from "@/assets/js/utils/ObjUtils";


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
            sysGroup: Number(item.sysgroup),
            title: item.title,
            isUnread: item.is_unread
        }))

        return {title, type: group_type, priority, data}
    }))
}

export const getFriendsTimeline = ({listId, fid, count = 10, sinceId, maxId, refresh = 4}) => {
    return wbGetRequest({
        url: '/feed/friendstimeline',
        params: {
            list_id: listId,
            since_id: sinceId,
            max_id: maxId,
            fid: fid ? fid : listId,
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
    //todo 编辑时间
    const {
        created_at,
        id,
        isLongText,
        mblogid,
        mblogtype,
        mlevel,
        pic_focus_point,
        pic_infos,
        pic_num,
        source,
        textLength,
        text_raw,
        url_struct,
        visible,
        user,
        retweeted_status,
        reposts_count,
        attitudes_count,
        comments_count,
    } = item

    //数量
    const counts = {
        reposts: reposts_count,
        attitudes: attitudes_count,
        comments: comments_count,
    }

    //todo 意义未明
    const blog = {
        uuid: mblogid,
        type: mblogtype,
        level: mlevel,
    }

    //todo
    const pictures = {
        num: pic_num,
        pic_infos, pic_focus_point
    }

    const timestamp = {
        create: new Date(created_at).toObj()
    }


    const content = {
        //todo
        // visible,

        isLongText,
        text: text_raw,
        length: textLength,
        timestamp,
        source,
        counts,
        blog,
        pictures,
        id,
        authorId: user.id,
    }
    //作者
    const author = {
        id: user.id,
        name: user.screen_name,
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
    }


    const data = {content, author,};

    if (retweeted_status) {
        content.retweeted = parse(retweeted_status)
    }
    return data
}