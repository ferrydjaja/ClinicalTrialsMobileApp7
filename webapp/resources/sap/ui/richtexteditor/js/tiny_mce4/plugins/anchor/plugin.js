tinymce.PluginManager.add('anchor',function(a){var b=function(n){return!n.attr('href')&&(n.attr('id')||n.attr('name'))&&!n.firstChild;};var s=function(e){return function(n){for(var i=0;i<n.length;i++){if(b(n[i])){n[i].attr('contenteditable',e);}}};};var c=function(i){return/^[A-Za-z][A-Za-z0-9\-:._]*$/.test(i);};var d=function(){var f=a.selection.getNode();var i=f.tagName=='A'&&a.dom.getAttrib(f,'href')==='';var v='';if(i){v=f.id||f.name||'';}a.windowManager.open({title:'Anchor',body:{type:'textbox',name:'id',size:40,label:'Id',value:v},onsubmit:function(e){var g=e.data.id;if(!c(g)){e.preventDefault();a.windowManager.alert('Id should start with a letter, followed only by letters, numbers, dashes, dots, colons or underscores.');return;}if(i){f.removeAttribute('name');f.id=g;}else{a.selection.collapse(true);a.execCommand('mceInsertContent',false,a.dom.createHTML('a',{id:g}));}}});};if(tinymce.Env.ceFalse){a.on('PreInit',function(){a.parser.addNodeFilter('a',s('false'));a.serializer.addNodeFilter('a',s(null));});}a.addCommand('mceAnchor',d);a.addButton('anchor',{icon:'anchor',tooltip:'Anchor',onclick:d,stateSelector:'a:not([href])'});a.addMenuItem('anchor',{icon:'anchor',text:'Anchor',context:'insert',onclick:d});});