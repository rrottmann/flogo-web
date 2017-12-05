import { Component, OnDestroy } from '@angular/core';
import { PostService } from '@flogo/core/services/post.service';
import { SUB_EVENTS, PUB_EVENTS } from './messages';

import {FlogoProfileService} from '@flogo/core/services/profile.service';
import { FLOGO_PROFILE_TYPE } from '@flogo/core/constants';

@Component(
  {
    selector : 'flogo-flow-task-add',
    templateUrl : 'task-add.component.html',
    styleUrls : [ 'task-add.component.less' ]
  }
)
export class FlogoFlowsDetailTasksComponent implements OnDestroy {
  public filteredTasks: any[] = [];
  private _filterQuery: string = null;
  public profileType: FLOGO_PROFILE_TYPE;

  public tasks: any[] = [];

  private _subscriptions: any;
  private _addTaskMsg: any;

  constructor(private _postService: PostService,
               private _profileService: FlogoProfileService ) {
    console.group( 'Constructing FlogoFlowsDetailTasksComponent' );

    this.initSubscribe();

    console.groupEnd();
  }

  ngOnDestroy() {
    this._subscriptions.forEach(
      ( sub: any ) => {
        this._postService.unsubscribe( sub );
      }
    );
  }

  public get filterQuery() {
    return this._filterQuery;
  }

  public set filterQuery(query: string){
    this._filterQuery = query;
    this._filterActivities();
  }

  public sendAddTaskMsg( task: any ) {

    this._postService.publish(
      _.assign(
        {}, PUB_EVENTS.addTask, {
          // TODO for the moment, the taskId can only be number, so timestamp is used.
          data : _.assign(
            {}, this._addTaskMsg, {
              task : _.assign( {}, task )
            }
          )
        }
      )
    );
  }

  private initSubscribe() {
    this._subscriptions = [];

    const subs = [
      _.assign( {}, SUB_EVENTS.addTask, { callback : this._getAddTaskMsg.bind( this ) } ),
      _.assign( {}, SUB_EVENTS.installActivity, { callback : this._loadActivities.bind( this ) } ),
    ];

    _.each(
      subs, sub => {
        this._subscriptions.push( this._postService.subscribe( sub ) );
      }
    );
  }

  private _loadActivities(profileType) {
    console.log('Loading activities');

    this._profileService.getActivities(profileType)
      .then(
        ( tasks: any ) => {
          this.tasks = tasks;
          this._filterActivities();
        }
      )
      .catch(
        ( err: any ) => {
          console.error( err );
        }
      );
  }


  private _getAddTaskMsg( data: any, envelope: any ) {
    console.group( 'Add task message in tasks' );

    console.log( data );
    console.log( envelope );


    this._addTaskMsg = data;
    this.profileType = this._addTaskMsg.appProfileType;
    this._loadActivities(this.profileType);

    console.groupEnd();
  }

  private _filterActivities() {
    if (this.filterQuery) {
      const filterQuery = this.filterQuery.toLowerCase();
      this.filteredTasks = _.filter(this.tasks, task => task.name.toLowerCase().indexOf(filterQuery) >= 0);
    } else {
      this.filteredTasks = this.tasks;
    }
  }

  public onInstalledAction( response: any ) {
    console.group( `[FlogoFlowsDetailTasks] onInstalled` );
    console.log( response );
    console.groupEnd();
    this._loadActivities(this._addTaskMsg.appProfileType);
  }

}
