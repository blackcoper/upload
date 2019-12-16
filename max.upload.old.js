/*!
  jQuery max Image Uploader plugin
  @name max.maxupload.js
  @author progamer
  @version 1.2
  @date-created 03/10/2014
  @last-updated 16/11/2016
  @category jQuery Plugin
  @copyright (c) 2014 maxsolution.co.id
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
  depedencies :
    jquery.ui.widget.js
    jquery.iframe-transport.js
    jquery.fileupload.js
*/

(function($){
  var maxupload, settings, defaultOptions, __bind;
  __bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  };

  defaultOptions = {
    url:'', //for upload temp if not support filereader html5
    maxHeight : 283,
    maxWidth : 283,
    filenameid : 'files',
    photo:'img/upload-foto.png',
    acceptFileTypes: '@',
    delete: function(){},
    ready: function(){},
    complete: function(){}
  };

  maxupload = (function(options) {
    function maxupload(handler, options){
      this.handler = handler;
      this.edit_tools = null;
      this.holder = null;
      this.aholder = null;
      this.preview = null;
      this.raw_image = null;
      this.filename_image = null;
      this.zoom = null;
      this.uploading = false;
      this.imagetemp = null;
      this._data = null;
      this.time_fade = null;
      this.is_loading = false;
      this._element = null;
      this.__element = null;
      this.draging = false;
      this.start_pos = null;
      this.element_pos = null;
      this.end_pos = null;
      this.photo = 'img/upload-foto.png';
      this._info = null;
      this.acceptFileTypes;
      this.ready;
      this.delete;
      this.complete;

      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      this.addEvent = __bind(this.addEvent, this);
      this.doneEvent = __bind(this.doneEvent, this);
      this.imgLoad = __bind(this.imgLoad, this);
      this.preReadLoad = __bind(this.preReadLoad, this);
      this.readLoad = __bind(this.readLoad, this);
      this.showImage = __bind(this.showImage,this);
      this.show_loading = __bind(this.show_loading,this);
      this.hide_loading = __bind(this.hide_loading,this);
      this.show_edit_tools = __bind(this.show_edit_tools,this);
      this.deleteEvent = __bind(this.deleteEvent,this);
      this.zoomInEvent = __bind(this.zoomInEvent,this);
      this.zoomOutEvent = __bind(this.zoomOutEvent,this);
      this.startEvent = __bind(this.startEvent,this);
      this.timeoutEndEvent = __bind(this.timeoutEndEvent,this);
      this.endEvent = __bind(this.endEvent,this);
      this.mouseStartEvent = __bind(this.mouseStartEvent,this);
      this.touchStartEvent = __bind(this.touchStartEvent,this);
      this.mouseMoveEvent = __bind(this.mouseMoveEvent,this);
      this.touchMoveEvent = __bind(this.touchMoveEvent,this);
      this.endDragingEvent = __bind(this.endDragingEvent,this);
      this.completeEvent = __bind(this.completeEvent,this);
      this.adjust_img = __bind(this.adjust_img,this);
      this.updateInfo = __bind(this.updateInfo,this);


      $.extend(true, this, defaultOptions, options);
      this.init();
      return maxupload;
    }
    maxupload.prototype.update = function(options) {
      $.extend(true, this, options);
    };
    maxupload.prototype.init = function(){
      _inputfile_size = (245/283)*this.maxHeight;
      _html = '<div id="holder" class="preview" style="overflow:hidden;height:'+this.maxHeight+'px;width:'+this.maxWidth+'px;position:relative;border-radius: 0px;">'+
                '<img id="preview" src="" style="display:none;cursor:move;position:absolute;-ms-touch-action: none">'+
                '<a href="javascript:void(0)" style="height:'+this.maxHeight+'px;width:'+this.maxWidth+'px;">'+
                  '<img parse_params="1" id="upload-poster" alt="upload-foto.png" src="'+this.photo+'" style="height:'+this.maxHeight+'px;width:'+this.maxWidth+'px;">'+
                '</a>'+
                '<div id="edit-tools" style="display:none;">'+
                  '<div id="left-tools" style="position:absolute;z-index:200;width: 64px;">'+
                    '<button id="zoom-in">+</button>'+
                    '<button id="zoom-out">-</button>'+
                  '</div>'+
                  '<div id="top-tools" style="position:absolute;z-index:200;right:0px;">'+
                    '<button id="delete">X</button>'+
                    '<button id="submit" style="display:none;">V</button>'+
                  '</div>'+
                  '<div id="bot-tools" style="display:none;position:absolute;z-index:200;bottom:0px;background-color:gray;color:white;padding:2px 5px 0px;">'+
                    'x:<input type="text" id="x" style="width:40px"/>px,y:<input type="text" id="y" style="width:40px"/>px,w:<input type="text" id="w" style="width:40px"/>px,h:<input type="text" id="h" style="width:40px"/>px'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<div id="warp_filename" style="height:'+this.maxHeight+'px;width:'+this.maxWidth+'px;overflow:hidden;position: relative;top: '+(this.maxHeight*-1)+'px;cursor:pointer;">'+
                '<input id="'+this.filenameid+'" type="file" accept="image/*" name="'+this.filenameid+'" style="top: 0px; left: 0px;font-size: '+_inputfile_size+'px; opacity: 0; filter:alpha(opacity: 0); margin: 0px;position: absolute;width:100%;height:100%;cursor:pointer">'+
              '</div>'
      $(this.handler).html(_html)
      this.edit_tools = $(this.handler).find('#edit-tools');
      $(this.handler).find('img').on('dragstart', function(event) { event.preventDefault(); });
      this.holder = $(this.handler).find('#holder')[0];
      this.aholder = $(this.handler).find('#holder a')[0];
      this.preview = $(this.handler).find('#preview')[0];
      this.raw_image = null;
      this.filename_image = null;
      //aholder.ondragover = function () { this.className = 'hover'; return false; };
      //aholder.ondragend = function () { this.className = ''; return false; };
      $(this.handler).find('#delete').on('click',this.deleteEvent);
      $(this.handler).find('#zoom-in').on('click',this.zoomInEvent);
      $(this.handler).find('#zoom-out').on('click',this.zoomOutEvent);
      $(this.handler).find('#submit').on('click',this.completeEvent);
      this.aholder.ondrop = this.showImage;
      if(typeof FileReader == 'undefined'){
        $(this.handler).find('#'+this.filenameid).fileupload({
          //replaceFileInput: false,
          url: this.url,
          type:'POST',
          dataType: 'json',
          // acceptFileTypes:this.acceptFileTypes,
          formData:{
            inputname:this.filenameid
          },
          // autoUpload: true,
          add: this.addEvent,
          done: this.doneEvent,
        })
      }else{
        $(this.handler).find('#'+this.filenameid).bind('change', this.showImage)
      }
    }
    maxupload.prototype.addEvent = function (e,data){
      var uploadErrors = [];
      var acceptFileTypes = this.acceptFileTypes;
      if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
        uploadErrors.push('Not an accepted file type');
      }
      if(data.originalFiles[0]['size'].length && data.originalFiles[0]['size'] > 5000000) {
        uploadErrors.push('Filesize is too big');
      }
      if(uploadErrors.length > 0) {
        alert(uploadErrors.join("\n"));
      } else {
        this.show_loading();
        data.submit();
      }
      // data.submit()
    }
    maxupload.prototype.doneEvent = function (e,data){

      // if(typeof data.result.url != 'undefined'){
      //   window.location.href = data.result.url;
      // }
      // for(var i in data.result[this.filenameid]){ // server files blueimp
      if(typeof data.result[this.filenameid][0].url  != 'undefined'){
        this.imagetemp = new Image();
        this.imagetemp.src = data.result[this.filenameid][0].url;
        this._data = data;
        this.imagetemp.onload = this.imgLoad;
      }
      // }
      // if(typeof data.result.full_path != 'undefined'){
      //   this.imagetemp = new Image();
      //   this.imagetemp.src = data.result.full_path;
      //   this._data = data;
      //   this.imagetemp.onload = this.imgLoad;
      // }
      uploading = false
    }
    maxupload.prototype.imgLoad = function(){
      $(this.preview).css({
        'margin-top': '0px',
        'margin-left': '0px'
      });
      $(this.preview).css('width', '')
      $(this.preview).css('height', '')
      this.preview.src = this._data.result[this.filenameid][0].url;
      this.filename_image = this._data.result.filename;
      if(this.imagetemp.width<this.imagetemp.height){
        _height =  this.imagetemp.height/this.imagetemp.width * this.maxHeight;
        if(_height<this.maxHeight){
          this.preview.height = this.maxHeight;
          _width =  this.imagetemp.width/this.imagetemp.height * this.maxWidth;
          this.preview.width = _width;
        }else{
          this.preview.height = _height;
          this.preview.width = this.maxWidth;
        }
        $(this.preview).css({
          //width: max,
          //height: _height,
          left: 0,
          top: (_height-this.maxHeight)/2*-1
        }).show();
      }else{
        _width =  this.imagetemp.width/this.imagetemp.height * this.maxWidth;
        this.preview.height = this.maxHeight;
        this.preview.width = _width;
        $(this.preview).css({
          //width: _width,
          //height: max,
          top: 0,
          left: (_width-this.maxWidth)/2*-1
        }).show();
      }
      this.show_edit_tools($(this.holder))
      this.adjust_img( $(this.preview))
      $(this.holder).trigger('mouseenter')
      $(this.handler).find('#warp_filename').hide();
      this.hide_loading();
      $(this.handler).find('#upload-poster').hide();
      this.ready && this.ready.call(null,this);
    }
    maxupload.prototype.preReadLoad = function(event){
      this._data = event;
      this.imagetemp = new Image();
      this.imagetemp.onload = this.readLoad;
      this.imagetemp.src = event.target.result;
    }
    maxupload.prototype.readLoad = function(){
       $(this.preview).css({
          'margin-top': '0px',
          'margin-left': '0px'
        });
        $(this.preview).css('width', '')
        $(this.preview).css('height', '')
        this.preview.src = this._data.target.result;
        raw_image = this._data.target.result;
        if(this.imagetemp.width<this.imagetemp.height){
          //_height =  this.imagetemp.height/this.imagetemp.width * this.maxHeight;
          _height =  this.maxWidth/this.imagetemp.width*this.imagetemp.height;
          if(_height<this.maxHeight){
            this.preview.height = this.maxHeight;
            _width =  this.maxHeight/this.imagetemp.height*this.imagetemp.width;
            this.preview.width = _width;
            $(this.preview).css({
              //width: _width,
              //height: max,
              top: 0,
              left: (_width-this.maxWidth)/2*-1
            }).show();
          }else{
            this.preview.height = _height;
            this.preview.width = this.maxWidth;
            $(this.preview).css({
              //width: max,
              //height: _height,
              left: 0,
              top: (_height-this.maxHeight)/2*-1
            }).show();
          }
        }else{
          //_width =  this.imagetemp.width/this.imagetemp.height * this.maxWidth
          _width =  this.maxHeight/this.imagetemp.height*this.imagetemp.width;
          if(_width<this.maxWidth){
            this.preview.width = this.maxWidth;
            _height =  this.maxWidth/this.imagetemp.width*this.imagetemp.height;
            this.preview.height = _height;
            $(this.preview).css({
              //width: max,
              //height: _height,
              left: 0,
              top: (_height-this.maxHeight)/2*-1
            }).show();
          }else{
            this.preview.height = this.maxHeight;
            this.preview.width = _width;
            $(this.preview).css({
              //width: _width,
              //height: max,
              top: 0,
              left: (_width-this.maxWidth)/2*-1
            }).show();
          }
        }
        this.show_edit_tools($(this.holder))
        this.adjust_img( $(this.preview))
        $(this.holder).trigger('mouseenter')
        $(this.handler).find('#warp_filename').hide();
        this.hide_loading();
        $(this.handler).find('#upload-poster').hide();
        this.ready && this.ready.call(null,this);
    }
    maxupload.prototype.showImage = function(input){
      this.className = '';
      //e.preventDefault();
      e = input
      var dt = e.dataTransfer || (e.originalEvent && e.originalEvent.dataTransfer);
      var file = e.target.files || (dt && dt.files);
      //file = false
      if (file) {
        // $(this.handler).show()
        reader = new FileReader();
        reader.onload = this.preReadLoad;
        reader.readAsDataURL(file[0]);
      }
    }
    maxupload.prototype.deleteEvent = function(){
      $(this.holder).off('mouseenter').off('mouseleave').off('touchstart').off('touchend')
      $(this.preview).attr('src','')
      $(this.preview).css('width', '0px')
      $(this.preview).css('height', '0px')
      $(this.handler).find('#'+this.filenameid).val('')
      $(this.handler).find('#warp_filename').show()
      $(this.edit_tools).hide()
      this.raw_image = null;
      this.filename_image = null;
      $(this.handler).find('#upload-poster').show();
      this.delete && this.delete.call(this);
    }
    maxupload.prototype.zoomInEvent = function(){
      ctx = $(this.holder)
      ctx_size = [parseFloat(ctx.width()),parseFloat(ctx.height())]
      img_size = [parseFloat($(this.preview).width()),parseFloat($(this.preview).height())]
      this.zoom = {};
      this.zoom.w = img_size[0]+(img_size[0]*5/100);
      this.zoom.h = img_size[1]+(img_size[1]*5/100);
      this.preview.height = this.zoom.h;
      this.preview.width = this.zoom.w;
      this.updateInfo()
    }
    maxupload.prototype.zoomOutEvent = function(){
      ctx = $(this.holder)
      ctx_size = [parseFloat(ctx.width()),parseFloat(ctx.height())]
      img_size = [parseFloat($(this.preview).width()),parseFloat($(this.preview).height())]
      this.zoom = {};
      this.zoom.w = img_size[0]-(img_size[0]*5/100);
      this.zoom.h = img_size[1]-(img_size[1]*5/100);
      if(this.zoom.w > ctx_size[0] && this.zoom.h > ctx_size[1]){
        this.preview.height = this.zoom.h;
        this.preview.width = this.zoom.w;
        _left = parseFloat($(this.preview).css('left'));
        _top = parseFloat($(this.preview).css('top'))
        _width = this.zoom.w-ctx_size[0];
        _height = this.zoom.h-ctx_size[1];
        $(this.preview).css({
          'left': _left > 0 ? 0 : _left < _width*-1 ? _width*-1 : _left,
          'top': _top > 0 ? 0 : _top < _height*-1 ? _height*-1 : _top
        })
        this.updateInfo()
      }
    }
    maxupload.prototype.show_loading = function(){
      if(this.is_loading)return;
      this.is_loading = true;
    }
    maxupload.prototype.hide_loading = function(){
      this.is_loading = false;
    }
    maxupload.prototype.startEvent = function(){
      if($(this.holder).data('time_fade'))clearTimeout($(this.holder).data('time_fade'));
      this.edit_tools.show();
      this._element.find('#left-tools').stop().animate({
        left:'0px'
      },200);
      this._element.find('#top-tools').stop().animate({
        top:'0px'
      },200);
      this._element.find('#bot-tools').stop().animate({
        'bottom':'0px'
      },200);
    }
    maxupload.prototype.timeoutEndEvent = function(){
      this._element.find('#left-tools').stop().animate({
        'left':'-61px',
      },200);
      this._element.find('#top-tools').stop().animate({
        'top':'-40px'
      },200);
      this._element.find('#bot-tools').stop().animate({
        'bottom':'-40px'
      },200);
    }
    maxupload.prototype.endEvent = function(){
      $(this.holder).data('time_fade',setTimeout(this.timeoutEndEvent,1000))
    }
    maxupload.prototype.show_edit_tools = function(element){
      this._element = $(element);
      $(this._element).on({
        'mouseenter' : this.startEvent,
        'touchstart' : this.startEvent,
        'touchend' : this.endEvent,
        'mouseleave' : this.endEvent
      })
      _info = this._element.find('#bot-tools')
      _preview = $(this.preview)
      _info.find('input').on('change',function(){
        switch($(this).attr('id')){
          case 'x':
            _preview.css('left',parseFloat($(this).val())+"px")
            break;
          case 'y':
            _preview.css('top',parseFloat($(this).val())+"px")
            break;
          case 'w':
            _preview.width(parseFloat($(this).val()))
            break;
          case 'h':
            _preview.height(parseFloat($(this).val()))
            break;
        }
      }).on('click',function(){
        this.setSelectionRange(0, this.value.length)
      })
      this.updateInfo()
    }
    maxupload.prototype.mouseStartEvent = function(event){
      this.start_pos = [event.pageX,event.pageY];
      this.element_pos = [parseFloat($(this.__element).css('left')),parseFloat($(this.__element).css('top'))]
      this.draging = true;
    }
    maxupload.prototype.touchStartEvent = function(event){
      event.preventDefault();
      touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
      this.start_pos = [touch.pageX,touch.pageY];
      this.element_pos = [parseFloat($(this.__element).css('left')),parseFloat($(this.__element).css('top'))]
      this.draging = true;
    }
    maxupload.prototype.mouseMoveEvent = function(event){
      if(this.draging){
        this.end_pos = [event.pageX,event.pageY];
        if(this.end_pos[0]-this.start_pos[0]>50 || this.end_pos[0]-this.start_pos[0]<50){
          _left = this.element_pos[0]+this.end_pos[0]-this.start_pos[0];
          _top = this.element_pos[1]+this.end_pos[1]-this.start_pos[1];
          _width = parseFloat($(this.__element).width())-parseFloat($(this.holder).width());
          _height = parseFloat($(this.__element).height())-parseFloat($(this.holder).height());
          this.__element.css({
            'left': _left > 0 ? 0 : _left < _width*-1 ? _width*-1 : _left,
            'top': _top > 0 ? 0 : _top < _height*-1 ? _height*-1 : _top
          })
        }
        this.updateInfo()
      }
    }
    maxupload.prototype.touchMoveEvent = function(event){
      if(this.draging){
        touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
        this.end_pos = [touch.pageX,touch.pageY];
        if(this.end_pos[0]-this.start_pos[0]>50 || this.end_pos[0]-this.start_pos[0]<50){
          _left = this.element_pos[0]+this.end_pos[0]-this.start_pos[0];
          _top = this.element_pos[1]+this.end_pos[1]-this.start_pos[1];
          _width = parseFloat($(this.__element).width())-parseFloat($(this.holder).width());
          _height = parseFloat($(this.__element).height())-parseFloat($(this.holder).height());
          this.__element.css({
            'left': _left > 0 ? 0 : _left < _width*-1 ? _width*-1 : _left,
            'top': _top > 0 ? 0 : _top < _height*-1 ? _height*-1 : _top
          })
        }
        this.updateInfo()
      }
    }
    maxupload.prototype.endDragingEvent = function(){
      this.draging = false;
    }
    maxupload.prototype.adjust_img = function(element){
      this.draging = false;
      this.__element = $(element);
      $(this.__element).on({
        'mousedown' : this.mouseStartEvent,
        'touchstart' : this.touchStartEvent,
        'mousemove' : this.mouseMoveEvent,
        'touchmove' : this.touchMoveEvent,
        'mouseup' : this.endDragingEvent,
        'touchend' : this.endDragingEvent,
        'mouseleave' : this.endDragingEvent
      })
    }
    maxupload.prototype.completeEvent = function(element){
      _result = $(this.preview)
      this.complete && this.complete.call( this, {x:_result.css('left'),y:_result.css('top'),w:_result.css('width'),h:_result.css('height')});
    }
    maxupload.prototype.changeSource = function(_src){
      $(this.preview).css({
        'margin-top': '0px',
        'margin-left': '0px'
      });
      $(this.preview).css('width', '')
      $(this.preview).css('height', '')
      this.preview.src = _src;
      this.filename_image = this._data.result.filename;
      if(this.imagetemp.width<this.imagetemp.height){
        _height =  this.imagetemp.height/this.imagetemp.width * this.maxHeight;
        if(_height<this.maxHeight){
          this.preview.height = this.maxHeight;
          _width =  this.imagetemp.width/this.imagetemp.height * this.maxWidth;
          this.preview.width = _width;
        }else{
          this.preview.height = _height;
          this.preview.width = this.maxWidth;
        }
        $(this.preview).css({
          //width: max,
          //height: _height,
          left: 0,
          top: (_height-this.maxHeight)/2*-1
        }).show();
      }else{
        _width =  this.imagetemp.width/this.imagetemp.height * this.maxWidth;
        this.preview.height = this.maxHeight;
        this.preview.width = _width;
        $(this.preview).css({
          //width: _width,
          //height: max,
          top: 0,
          left: (_width-this.maxWidth)/2*-1
        }).show();
      }
      this.show_edit_tools($(this.holder))
      this.adjust_img( $(this.preview))
      $(this.holder).trigger('mouseenter')
      $(this.handler).find('#warp_filename').hide();
      this.hide_loading();
      this.ready && this.ready.call(null,this);
    }
    maxupload.prototype.updateInfo = function(){
      if (_info){
        _info.find('#x').val(parseFloat($(this.preview).css('left')))
        _info.find('#y').val(parseFloat($(this.preview).css('top')))
        _info.find('#w').val(parseFloat($(this.preview).css('width')))
        _info.find('#h').val(parseFloat($(this.preview).css('height')))
      }
    }
    return maxupload;
  })();

  $.fn.maxupload = function(options){
    if (!this.imgloadInstance) {
      this.imgloadInstance = new maxupload(this, options || {});
    } else {
      this.imgloadInstance.update(options || {});
    }
    // console.log(this.imgloadInstance)
    this.imgloadInstance();
    return this;
  }
})(jQuery);
