/** @about Easy Media 1.1.4 @min_zeppos 3.0 @author: Silver, Zepp Health. @license: MIT */
import{create,id}from"@zos/media";import{openSync,writeSync,closeSync,statSync,O_RDWR,O_CREAT,O_TRUNC}from"@zos/fs";import{debugLog,QuickJS,setDebugLevel,TimeIt}from"./required/helpers";import{__SPExtra}from"./required/player-extra";import{MINI_MP3}from"./required/mini-mp3";const ERR={ONLY_ONE_INST:"Only 1 instance is supported. Returning existing instance."};export class SoundPlayer{#instance=null;#player;#file_info={full_path:"",path:"",name:""};#is_playing;#play_start_time;#auto_destroy;#get;#set;#cb_prepare=null;#cb_complete=null;#cb_on_complete=null;#cb_on_fail=null;#play_timeout=null;#play_timeout_duration=3e3;#use_queue;#queue_arr=[];get get(){return this.#get}get set(){return this.#set}constructor(options={}){if(this.#instance){debugLog(1,ERR.ONLY_ONE_INST);return this.#instance}TimeIt(3,()=>{const{path,stop_on_change,use_queue,onComplete}=options;this.#player=create(id.PLAYER);this.#auto_destroy=stop_on_change??false;this.#is_playing=false;this.#cb_on_complete=onComplete??null;this.#use_queue=use_queue??true;this.#get=new __SPExtra.Get(this.#player,()=>this.#is_playing);this.#set=new __SPExtra.Set(this.#player,this);this.#setupEventListeners();if(path){this.#updateFileInfo(path);this.#player.setSource(this.#player.source.FILE,{file:path})}this.#instance=this})}onComplete(callback){this.#cb_on_complete=callback}onFail(callback){this.#cb_on_fail=callback}setFailTimeout(ms){if(ms<0){debugLog(1,"Timeout can't be a negative number.");return}this.#play_timeout_duration=ms}play(path){TimeIt(3,()=>{this.#resetPlaybackMonitor();if(path){this.changeFile(path)}const fp=this.#file_info.full_path;if(!fp){debugLog(1,"No file set. Can't play.");return}if(this.#is_playing&&this.#use_queue){this.#queue_arr.push(path||fp);debugLog(4,`Added to queue: ${path||fp}`);return}if(this.#is_playing&&this.#auto_destroy){this.stop()}this.#is_playing=true;this.#play_start_time=QuickJS.now();this.#player.setSource(this.#player.source.FILE,{file:fp});this.#player.prepare()})}pause(){debugLog(3);if(this.#is_playing){this.#player.pause();this.#is_playing=false}}resume(){debugLog(3);if(!this.#is_playing){this.#player.resume();this.#is_playing=true}}stop(){TimeIt(3,()=>{if(this.#is_playing){this.#player.stop();this.#player.release()}this.#is_playing=false})}changeFile(path){TimeIt(3,`New file: ${path}`,()=>{this.#resetPlaybackMonitor();if(this.#is_playing&&this.#auto_destroy){this.stop()}this.#updateFileInfo(path)})}destroy(){TimeIt(3,()=>{if(this.#is_playing){this.stop()}if(this.#player){this.#player.addEventListener(this.#player.event.PREPARE,QuickJS.noop());this.#player.addEventListener(this.#player.event.COMPLETE,QuickJS.noop());this.#cb_prepare=null;this.#cb_complete=null;this.#resetPlaybackMonitor();this.#player=null}})}isSpeakerAvailable(callback){TimeIt(3,()=>{const fp="data://em_speaker_test.mp3";try{const stat=statSync({path:fp});if(stat&&stat.size===MINI_MP3.length){this.#playTestFile(callback,fp);return}let fd=openSync({path:fp,flag:O_RDWR|O_CREAT|O_TRUNC});writeSync({fd:fd,buffer:MINI_MP3.buffer});closeSync(fd);this.#playTestFile(callback,fp)}catch(error){debugLog(1,"Error in isSpeakerAvailable:",error);callback(false)}})}#setupEventListeners(){this.#cb_prepare=result=>{debugLog(3,`(event) PREPARE. Result: ${result}`);if(result){this.#player.start();this.#setupFailMonitor()}else{debugLog(1,"(event) PREPARE. ERR: Releasing resources!");this.#player.release();this.#resetPlaybackMonitor();if(this.#cb_on_fail){const info=this.#getPlaybackInfo();this.#cb_on_fail(info)}}};this.#cb_complete=()=>{debugLog(3,"(event) COMPLETE");this.#resetPlaybackMonitor();const info=this.#getPlaybackInfo(true);this.stop();if(this.#cb_on_complete)this.#cb_on_complete(info);if(this.#use_queue)this.#queuePlayNext()};this.#player.addEventListener(this.#player.event.PREPARE,this.#cb_prepare);this.#player.addEventListener(this.#player.event.COMPLETE,this.#cb_complete)}#setupFailMonitor(){if(this.#cb_on_fail){const duration=this.get.duration();const dur=duration*1e3+this.#play_timeout_duration;this.#play_timeout=setTimeout(()=>{if(this.#is_playing){const info=this.#getPlaybackInfo();this.#cb_on_fail(info)}},dur)}}#playTestFile(cb,fp){const _cb_on_complete=this.#cb_on_complete;const _cb_on_fail=this.#cb_on_fail;this.onComplete(()=>{this.#cb_on_complete=_cb_on_complete;this.#cb_on_fail=_cb_on_fail;cb(true)});this.onFail(()=>{this.#cb_on_complete=_cb_on_complete;this.#cb_on_fail=_cb_on_fail;cb(false)});this.play(fp)}#queuePlayNext(){if(this.#queue_arr.length>0){const next=this.#queue_arr.shift();this.play(next);debugLog(3,`Playing from queue: ${next}`)}}#updateFileInfo(full_path){const last=full_path.lastIndexOf("/");this.#file_info.full_path=full_path;this.#file_info.path=last===-1?"":full_path.slice(0,last+1);this.#file_info.name=last===-1?full_path:full_path.slice(last+1)}#getPlaybackInfo(precise=false){const info={full_path:this.#file_info.full_path,path:this.#file_info.path,name:this.#file_info.name};if(precise&&this.#play_start_time){info.duration=QuickJS.now()-this.#play_start_time}else{info.duration=this.get.duration()*1e3}return info}#resetPlaybackMonitor(){debugLog(3);if(this.#play_timeout){clearTimeout(this.#play_timeout);this.#play_timeout=null}}static SetLogLevel(level){setDebugLevel(level);debugLog(1,`Log level set to ${level}`)}}
