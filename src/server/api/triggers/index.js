import {config, triggersDBService} from '../../config/app-config';
import { TYPE_TRIGGER, DEFAULT_PATH_TRIGGER } from '../../common/constants';
import { RemoteInstaller } from '../../modules/remote-installer';
import { inspectObj } from '../../common/utils';
import _ from 'lodash';
import path from 'path';

let basePath = config.app.basePath;

let remoteInstaller = new RemoteInstaller( {
  type : TYPE_TRIGGER,
  registerPath : path.join( config.rootPath, DEFAULT_PATH_TRIGGER )
} );

export function triggers(app, router){
  if(!app){
    console.error("[Error][api/triggers/index.js]You must pass app");
  }
  router.get(basePath+"/triggers", getTriggers);
  router.post(basePath+"/triggers", installTriggers);
  router.delete(basePath+"/triggers", deleteTriggers);
}

function* getTriggers(next){
  let data = [];

  data = yield triggersDBService.allDocs({ include_docs: true })
    .then(triggers => triggers.map(trigger => {
      return Object.assign({}, _.pick(trigger, ['_id', 'name', 'title', 'version', 'description']), { title: _.get(trigger, 'schema.title')});
    }));

  this.body = data;
  yield next;
}

function* installTriggers( next ) {
  let urls = preProcessURLs( this.request.body.urls );

  console.log( '[log] Install Triggers' );
  inspectObj( urls );
  let results = yield remoteInstaller.install( urls );
  console.log( '[log] Installation results' );
  inspectObj( {
    success : results.success,
    fail : results.fail
  } );

  delete results.details; // keep the details internally.
  this.body = results;

  yield next;
}

function* deleteTriggers( next ) {

  console.log( '------- ------- -------' );
  console.log( 'Delete Triggers' );
  console.log( this.request.body.urls );
  this.body = 'TODO';
  console.log( '------- ------- -------' );

  yield next;
}

function preProcessURLs( urls ) {
  'use strict';
  // TODO
  return urls;
}
