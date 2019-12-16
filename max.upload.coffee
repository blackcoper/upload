  # jQuery max Image Uploader plugin
  # @name max.maxupload.js
  # @author progamer
  # @version 2
  # @date-created 03/10/2014
  # @last-updated 10/10/2016
  # @category jQuery Plugin
  # @copyright (c) 2014 maxsolution.co.id
  # @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
  # depedencies :
  #   jquery.js
  #   jquery.ui.widget.js
  #   jquery.iframe-transport.js
  #   jquery.fileupload.js

 do->
  @maxupload = ()->

    #global variable
    @wrapper = null
    @preview = null
    @options = null
    @_image = 12
    defaults =
      wrapper         : '#maxupload'
      url             : 'upload.php'
      height          : 256
      width           : 256
      tagname         : 'files'
      photo           : 'img/upload-foto.png'
      acceptFile      : 'image/*'
      acceptFileTypes : /(\.|\/)(gif|jpe?g|png)$/i
      delete          : ()->
      ready           : ()->
      complete        : ()->

    extendDefaults = (source, properties) ->
      property = undefined
      for property of properties
        `property = property`
        if properties.hasOwnProperty property
          source[property] = properties[property]
      source

    if arguments[0] and typeof arguments[0] is "object"
      @options = extendDefaults defaults,arguments[0]
    else
      @options = defaults

    readLoad = ->
      @preview.css
        'margin-top': '0px'
        'margin-left': '0px'
      @preview.css 'width', ''
      @preview.css 'height', ''
      @preview.src = $(@).attr('src')
      if @_image.width < @_image.height
        #_height =  this.imagetemp.height/this.imagetemp.width * this.maxHeight;
        _height = @options.width / @_image.width * @_image.height
        if _height < @options.height
          @preview.height = @options.height
          _width = @options.height / @_image.height * @_image.width
          @preview.width = _width
          @preview.css(
            top: 0
            left: (_width - (@options.width)) / 2 * -1).show()
        else
          @preview.height = _height
          @preview.width = @options.width
          @preview.css(
            left: 0
            top: (_height - (@options.height)) / 2 * -1).show()
      else
        #_width =  this.imagetemp.width/this.imagetemp.height * this.maxWidth
        _width = @options.height / @_image.height * @_image.width
        if _width < @options.width
          @preview.width = @options.width
          _height = @options.width / @_image.width * @_image.height
          @preview.height = _height
          @preview.css(
            left: 0
            top: (_height - (@options.height)) / 2 * -1).show()
        else
          @preview.height = @options.height
          @preview.width = _width
          @preview.css(
            top: 0
            left: (_width - (@options.width)) / 2 * -1).show()
      @show_edit_tools $(@holder)
      @adjust_img $(@preview)
      $(@holder).trigger 'mouseenter'
      $(@handler).find('#warp_filename').hide()
      @hide_loading()
      $(@handler).find('#upload-poster').hide()
      @ready and @ready.call(null, this)

    @showImage = (input) ->
      ctx = this
      @className = ''
      #e.preventDefault();
      e = input
      dt = e.dataTransfer or e.originalEvent and e.originalEvent.dataTransfer
      file = e.target.files or dt and dt.files
      #file = false
      if file
        # $(this.handler).show()
        reader = new FileReader
        reader.onload = (event)->
          _data = event;
          ctx._image = new Image()
          ctx._image.onload = readLoad
          ctx._image.src = event.target.result
        reader.readAsDataURL file[0]



    @show_edit_tools = (element) ->
      @_element = $(element)
      $(@_element).on
        'mouseenter': @startEvent
        'touchstart': @startEvent
        'touchend': @endEvent
        'mouseleave': @endEvent
      _info = @_element.find('#bot-tools')
      _preview = $(@preview)
      _info.find('input').on('change', ->
        switch $(this).attr('id')
          when 'x'
            _preview.css 'left', parseFloat($(this).val()) + 'px'
          when 'y'
            _preview.css 'top', parseFloat($(this).val()) + 'px'
          when 'w'
            _preview.width parseFloat($(this).val())
          when 'h'
            _preview.height parseFloat($(this).val())
        return
      ).on 'click', ->
        @setSelectionRange 0, @value.length
        return
      @updateInfo()
      return

    @addEvent = (e,data)->
      uploadErrors = []
      acceptFileTypes = @acceptFileTypes
      if data.originalFiles[0]['type'].length and !acceptFileTypes.test(data.originalFiles[0]['type'])
        uploadErrors.push 'Not an accepted file type'
      if data.originalFiles[0]['size'].length and data.originalFiles[0]['size'] > 5000000
        uploadErrors.push 'Filesize is too big'
      if uploadErrors.length > 0
        alert uploadErrors.join('\n')
      else
        @show_loading()
        data.submit()

    @doneEvent = (e,data)->
      if typeof data.result[this.filenameid][0].url  isnt 'undefined'
        this.imagetemp = new Image()
        this.imagetemp.src = data.result[this.filenameid][0].url
        this._data = data
        this.imagetemp.onload = this.imgLoad
      uploading = false

    readLoad.bind(this)

    @init()

  maxupload::init = ()->
    # a,img  style="width:'+@options.width+'px;height:'+@options.height+'px;"
    # warp_filename input font-size: '+_inputfile_size+'px;
    @wrapper = $(@options.wrapper)
    _html = '<div id="holder" class="wrapper-maxupload" style="width:'+@options.width+'px;height:'+@options.height+'px;">'+
      '<img id="preview" class="preview-maxupload" src="">'+
      '<a href="javascript:void(0)">'+
        '<img src="'+@options.photo+'" class="poster-maxupload">'+
      '</a>'+
      '<div id="edit" class="edit-maxupload">'+
        '<div id="left-tools">'+
          '<button id="zoomin">+</button>'+
          '<button id="zoomout">-</button>'+
        '</div>'+
        '<div id="top-tools">'+
          '<button id="delete">X</button>'+
          '<button id="submit">V</button>'+
        '</div>'+
      '<div id="bot-tools">'+
        'x:<input type="text" id="x"/>px,y:<input type="text" id="y"/>px,w:<input type="text" id="w"/>px,h:<input type="text" id="h"/>px'+
      '</div>'+
      '</div>'+
      '<div id="filename" class="filename-maxupload" style="width:'+@options.width+'px;height:'+@options.height+'px;">'+
        '<input id="'+@options.tagname+'" type="file" accept="'+@options.acceptFile+'" name="'+@options.tagname+'">'+
      '</div>'+
      '</div>'
    @wrapper.html(_html)
    @preview = @wrapper.find('#preview')
    @wrapper.find('img').on 'dragstart',(event)->
      event.preventDefault()
    # @options.wrapper.find('#delete').on 'click',@deleteEvent
    # @options.wrapper.find('#zoomin').on 'click',@zoomInEvent
    # @options.wrapper.find('#zoomout').on 'click',@zoomOutEvent
    # @options.wrapper.find('#submit').on 'click',@completeEvent
    if typeof FileReader is 'undefined'
      @wrapper.find('#'+@options.tagname).fileupload
        url: this.url
        type:'POST'
        dataType: 'json'
        formData:
          inputname:@options.tagname
        add: addEvent
        done: doneEvent
    else
      @wrapper.find('#'+@options.tagname).bind 'change',@showImage.bind(this)
