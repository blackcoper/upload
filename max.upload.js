(function() {
  this.maxupload = function() {
    var defaults, extendDefaults, readLoad;
    this.wrapper = null;
    this.preview = null;
    this.options = null;
    this._image = 12;
    defaults = {
      wrapper: '#maxupload',
      url: 'upload.php',
      height: 256,
      width: 256,
      tagname: 'files',
      photo: 'img/upload-foto.png',
      acceptFile: 'image/*',
      acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
      "delete": function() {},
      ready: function() {},
      complete: function() {}
    };
    extendDefaults = function(source, properties) {
      var property;
      property = void 0;
      for (property in properties) {
        property = property;
        if (properties.hasOwnProperty(property)) {
          source[property] = properties[property];
        }
      }
      return source;
    };
    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    } else {
      this.options = defaults;
    }
    readLoad = function() {
      var _height, _width;
      this.preview.css({
        'margin-top': '0px',
        'margin-left': '0px'
      });
      this.preview.css('width', '');
      this.preview.css('height', '');
      this.preview.src = $(this).attr('src');
      if (this._image.width < this._image.height) {
        _height = this.options.width / this._image.width * this._image.height;
        if (_height < this.options.height) {
          this.preview.height = this.options.height;
          _width = this.options.height / this._image.height * this._image.width;
          this.preview.width = _width;
          this.preview.css({
            top: 0,
            left: (_width - this.options.width) / 2 * -1
          }).show();
        } else {
          this.preview.height = _height;
          this.preview.width = this.options.width;
          this.preview.css({
            left: 0,
            top: (_height - this.options.height) / 2 * -1
          }).show();
        }
      } else {
        _width = this.options.height / this._image.height * this._image.width;
        if (_width < this.options.width) {
          this.preview.width = this.options.width;
          _height = this.options.width / this._image.width * this._image.height;
          this.preview.height = _height;
          this.preview.css({
            left: 0,
            top: (_height - this.options.height) / 2 * -1
          }).show();
        } else {
          this.preview.height = this.options.height;
          this.preview.width = _width;
          this.preview.css({
            top: 0,
            left: (_width - this.options.width) / 2 * -1
          }).show();
        }
      }
      this.show_edit_tools($(this.holder));
      this.adjust_img($(this.preview));
      $(this.holder).trigger('mouseenter');
      $(this.handler).find('#warp_filename').hide();
      this.hide_loading();
      $(this.handler).find('#upload-poster').hide();
      return this.ready && this.ready.call(null, this);
    };
    this.showImage = function(input) {
      var ctx, dt, e, file, reader;
      ctx = this;
      this.className = '';
      e = input;
      dt = e.dataTransfer || e.originalEvent && e.originalEvent.dataTransfer;
      file = e.target.files || dt && dt.files;
      if (file) {
        reader = new FileReader;
        reader.onload = function(event) {
          var _data;
          _data = event;
          ctx._image = new Image();
          ctx._image.onload = readLoad;
          return ctx._image.src = event.target.result;
        };
        return reader.readAsDataURL(file[0]);
      }
    };
    this.show_edit_tools = function(element) {
      var _info, _preview;
      this._element = $(element);
      $(this._element).on({
        'mouseenter': this.startEvent,
        'touchstart': this.startEvent,
        'touchend': this.endEvent,
        'mouseleave': this.endEvent
      });
      _info = this._element.find('#bot-tools');
      _preview = $(this.preview);
      _info.find('input').on('change', function() {
        switch ($(this).attr('id')) {
          case 'x':
            _preview.css('left', parseFloat($(this).val()) + 'px');
            break;
          case 'y':
            _preview.css('top', parseFloat($(this).val()) + 'px');
            break;
          case 'w':
            _preview.width(parseFloat($(this).val()));
            break;
          case 'h':
            _preview.height(parseFloat($(this).val()));
        }
      }).on('click', function() {
        this.setSelectionRange(0, this.value.length);
      });
      this.updateInfo();
    };
    this.addEvent = function(e, data) {
      var acceptFileTypes, uploadErrors;
      uploadErrors = [];
      acceptFileTypes = this.acceptFileTypes;
      if (data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
        uploadErrors.push('Not an accepted file type');
      }
      if (data.originalFiles[0]['size'].length && data.originalFiles[0]['size'] > 5000000) {
        uploadErrors.push('Filesize is too big');
      }
      if (uploadErrors.length > 0) {
        return alert(uploadErrors.join('\n'));
      } else {
        this.show_loading();
        return data.submit();
      }
    };
    this.doneEvent = function(e, data) {
      var uploading;
      if (typeof data.result[this.filenameid][0].url !== 'undefined') {
        this.imagetemp = new Image();
        this.imagetemp.src = data.result[this.filenameid][0].url;
        this._data = data;
        this.imagetemp.onload = this.imgLoad;
      }
      return uploading = false;
    };
    readLoad.bind(this);
    return this.init();
  };
  return maxupload.prototype.init = function() {
    var _html;
    this.wrapper = $(this.options.wrapper);
    _html = '<div id="holder" class="wrapper-maxupload" style="width:' + this.options.width + 'px;height:' + this.options.height + 'px;">' + '<img id="preview" class="preview-maxupload" src="">' + '<a href="javascript:void(0)">' + '<img src="' + this.options.photo + '" class="poster-maxupload">' + '</a>' + '<div id="edit" class="edit-maxupload">' + '<div id="left-tools">' + '<button id="zoomin">+</button>' + '<button id="zoomout">-</button>' + '</div>' + '<div id="top-tools">' + '<button id="delete">X</button>' + '<button id="submit">V</button>' + '</div>' + '<div id="bot-tools">' + 'x:<input type="text" id="x"/>px,y:<input type="text" id="y"/>px,w:<input type="text" id="w"/>px,h:<input type="text" id="h"/>px' + '</div>' + '</div>' + '<div id="filename" class="filename-maxupload" style="width:' + this.options.width + 'px;height:' + this.options.height + 'px;">' + '<input id="' + this.options.tagname + '" type="file" accept="' + this.options.acceptFile + '" name="' + this.options.tagname + '">' + '</div>' + '</div>';
    this.wrapper.html(_html);
    this.preview = this.wrapper.find('#preview');
    this.wrapper.find('img').on('dragstart', function(event) {
      return event.preventDefault();
    });
    if (typeof FileReader === 'undefined') {
      return this.wrapper.find('#' + this.options.tagname).fileupload({
        url: this.url,
        type: 'POST',
        dataType: 'json',
        formData: {
          inputname: this.options.tagname
        },
        add: addEvent,
        done: doneEvent
      });
    } else {
      return this.wrapper.find('#' + this.options.tagname).bind('change', this.showImage.bind(this));
    }
  };
})();
