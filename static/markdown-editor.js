window.webcopyEditor = (function () {

    var storageKey = pagespace.getKey();
    var simplemde = false;
    var contentChanged = false;
    var data = null;

    function init() {

        localforage.getItem(storageKey).then(function(cachedMd) {
            pagespace.getData().then(function(_data) {
                if(cachedMd) {
                    _data.md = cachedMd;
                }
                data = _data;

                setUpEditor();
                listenForChanges();
            });
        });
    }

    function setUpEditor() {

        var textareaEl = document.getElementById("markdown");

        simplemde = new SimpleMDE({
            element: textareaEl,
            autofocus: true,
            hideIcons: [
                'side-by-side',
                'fullscreen'
            ]
        });
        simplemde.value(data.md);
        simplemde.codemirror.on("change", function(){
            contentChanged = true;
        });
    }



    function listenForChanges() {

        function save() {
            var md = simplemde.value();
            return pagespace.setData({
                wrapperClass: data.wrapperClass || '',
                cssHref: data.cssHref,
                md: md
            }).then(function() {
                //remove draft
                return localforage.removeItem(storageKey);
            }).then(function() {
                pagespace.close();
            });
        }

        document.getElementById('btnSave').addEventListener('click', function() {
            save();
        });

        function saveDraft() {
            var md = simplemde.value()
            return localforage.setItem(storageKey, md);
        }

        function saveOnChange() {
            setTimeout(function() {
                if(contentChanged) {
                    saveDraft().then(function() {
                        console.info('Draft saved');
                        contentChanged = false;
                        saveOnChange();
                    }).catch(function(err) {
                         console.error(err, 'Error saving draft');
                    });
                } else {
                    saveOnChange();
                }
             }, 500);
        }
        saveOnChange();
    }

    return init();
})();