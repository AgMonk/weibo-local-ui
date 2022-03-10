# weibo-local-ui

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

```nginx
server {
    listen       11111;
    server_name  localhost;
    proxy_ssl_server_name on;
    proxy_ssl_protocols TLSv1 TLSv1.1 TLSv1.2;


    location / {
        root   wb;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location ^~ /wb-api/ {
        proxy_pass https://weibo.com/ajax/;
    }

    location ^~ /wx1/ {
        proxy_pass https://wx2.sinaimg.cn/;
        proxy_set_header Referer https://weibo.com/;
    }
    location ^~ /wx2/ {
        proxy_pass https://wx2.sinaimg.cn/;
        proxy_set_header Referer https://weibo.com/;
    }
    location ^~ /wx3/ {
        proxy_pass https://wx2.sinaimg.cn/;
        proxy_set_header Referer https://weibo.com/;
    }
    location ^~ /wx4/ {
        proxy_pass https://wx2.sinaimg.cn/;
        proxy_set_header Referer https://weibo.com/;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}
```