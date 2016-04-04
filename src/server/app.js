import koa from 'koa';
import koaStatic from 'koa-static';
var router = require('koa-router')();
import bodyparser from 'koa-bodyparser';
import compress from 'koa-compress';
import {config} from './config/app-config';
import {activities} from './api/activities';
import {RegisterActivities} from './packages/activities/register-activities';

let app = koa();
let port = config.app.port;

activities(app, router);

let registerActivities  = new RegisterActivities();

// logger
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// make sure deep link it works
app.use(function *(next){
  var path = this.path.endsWith('/')? this.path.substring(0, this.path.length - 1): this.path;

  // not include restful api
  if(!/\/[^\/]+\.[^.\/]+$/i.test(path)&&path.toLowerCase().search('/api/')===-1){
    this.path='/';
  }
  yield  next;
});

// compress
app.use(compress({
  filter: function (content_type) {
    return /text/i.test(content_type)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}));

app.use(koaStatic("../public"));
app.use(bodyparser());

app.use(router.routes());

app.listen(port);
