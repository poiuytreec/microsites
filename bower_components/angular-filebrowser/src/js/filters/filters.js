(function(angular) {
    "use strict";
    var app = angular.module('FileManagerApp');

    app.filter('strLimit', ['$filter', function($filter) {
        return function(input, limit) {
            if (input.length <= limit) {
                return input;
            }
            return $filter('limitTo')(input, limit) + '...';
        };
    }]);

    app.filter('formatDate', ['$filter', function($filter) {
        return function(input, limit) {
            return input instanceof Date ?
                input.toISOString().substring(0, 19).replace('T', ' ') :
                (input.toLocaleString || input.toString).apply(input);
        };
    }]);

    app.filter('fileIcon', ['$filter', function($filter) {
        return function(fname) {
            var extensionIcons = {
                'parentdir': 'fa-level-up fa-flip-horizontal',
                'xls': 'fa-file-excel-o',
                'xlsx': 'fa-file-excel-o',
                'doc': 'fa-file-word-o',
                'docx': 'fa-file-word-o',
                'ppt': 'fa-file-powerpoint-o',
                'pptx': 'fa-file-powerpoint-o',
                'pdf': 'fa-file-pdf-o',
                'mpg4': " ",
                'hqx': 'fa-file-archive-o',
                'cpt': 'fa-file-archive-o',
                'csv': 'fa-file-code-o',
                'bin': 'fa-file-exe-o',
                'dms': '',
                'lha': '',
                'lzh': '',
                'exe': 'fa-file-exe-o',
                'class': 'fa-file-code-o',
                'psd': '',
                'so': '',
                'sea': '',
                'dll': 'fa-file-exe-o',
                'oda': '',
                'ai': '',
                'eps': '',
                'ps': '',
                'smi': '',
                'smil': '',
                'mif': 'fa-file-code-o',
                'wbxml': 'fa-file-code-o',
                'wmlc': 'fa-file-code-o',
                'dcr': 'fa-file-movie-o',
                'dir': 'fa-file-movie-o',
                'dxr': 'fa-file-movie-o',
                'dvi': 'fa-file-movie-o',
                'gtar': 'fa-file-archive-o',
                'gz': 'fa-file-archive-o',
                'php': 'fa-file-code-o',
                'php4': 'fa-file-code-o',
                'php3': 'fa-file-code-o',
                'phtml': 'fa-file-code-o',
                'phps': 'fa-file-code-o',
                'js': 'fa-file-code-o',
                'swf': 'fa-file-code-o',
                'sit': 'fa-file-archive-o',
                'tar': 'fa-file-archive-o',
                'tgz': 'fa-file-archive-o',
                'xhtml': 'fa-file-code-o',
                'xht': 'fa-file-code-o',
                'zip': 'fa-file-zip-o',
                'mid': 'fa-file-audio-o',
                'midi': 'fa-file-audio-o',
                'mpga': 'fa-file-audio-o',
                'mp2': 'fa-file-audio-o',
                'mp3': 'fa-file-audio-o',
                'aif': 'fa-file-audio-o',
                'aiff': 'fa-file-audio-o',
                'aifc': 'fa-file-audio-o',
                'ram': 'fa-file-audio-o',
                'rm': 'fa-file-audio-o',
                'rpm': 'fa-file-audio-o',
                'ra': 'fa-file-audio-o',
                'rv': 'fa-file-movie-o',
                'wav': 'fa-file-audio-o',
                'bmp': 'fa-file-image-o',
                'gif': 'fa-file-image-o',
                'jpeg': 'fa-file-image-o',
                'jpg': 'fa-file-image-o',
                'jpe': 'fa-file-image-o',
                'png': 'fa-file-image-o',
                'tiff': 'fa-file-image-o',
                'tif': 'fa-file-image-o',
                'css': 'fa-file-code-o',
                'html': 'fa-file-code-o',
                'htm': 'fa-file-code-o',
                'shtml': 'fa-file-code-o',
                'txt': 'fa-file-text-o',
                'text': 'fa-file-text-o',
                'log': 'fa-file-text-o',
                'rtx': 'fa-file-text-o',
                'rtf': 'fa-file-text-o',
                'xml': 'fa-file-code-o',
                'xsl': 'fa-file-code-o',
                'mpeg': 'fa-file-movie-o',
                'mpg': 'fa-file-movie-o',
                'mpe': 'fa-file-movie-o',
                'qt': 'fa-file-movie-o',
                'mov': 'fa-file-movie-o',
                'avi': 'fa-file-movie-o',
                'movie': 'fa-file-movie-o',
                'eml': '',
                'json': 'fa-file-code-o'
            };
            var extension = fname.substr((~-fname.lastIndexOf(".") >>> 0) + 2);

            if (extension) {
                var iconClass = extensionIcons[extension.toLowerCase()];
                return iconClass ? iconClass : 'fa-file-o';
            } else {
                return 'fa-file-o';
            }
        };
    }])


    app.filter('codeMirrorEditorMode', ['$filter', function($filter) {
        return function(fname) {
            var editorModeMap = {
                "groovy": "groovy",
                "ini": "properties",
                "properties": "properties",
                "css": "css",
                "scss": "css",
                "html": "htmlmixed",
                "htm": "htmlmixed",
                "shtm": "htmlmixed",
                "shtml": "htmlmixed",
                "xhtml": "htmlmixed",
                "cfm": "htmlmixed",
                "cfml": "htmlmixed",
                "cfc": "htmlmixed",
                "dhtml": "htmlmixed",
                "xht": "htmlmixed",
                "tpl": "htmlmixed",
                "twig": "htmlmixed",
                "hbs": "htmlmixed",
                "handlebars": "htmlmixed",
                "kit": "htmlmixed",
                "jsp": "htmlmixed",
                "aspx": "htmlmixed",
                "ascx": "htmlmixed",
                "asp": "htmlmixed",
                "master": "htmlmixed",
                "cshtml": "htmlmixed",
                "vbhtml": "htmlmixed",
                "ejs": "htmlembedded",
                "dust": "htmlembedded",
                "erb": "htmlembedded",
                "jade": "jade",
                "js": "javascript",
                "jsx": "javascript",
                "jsm": "javascript",
                "_js": "javascript",
                "vbs": "vbscript",
                "vb": "vb",
                "json": "javascript",
                "xml": "xml",
                "svg": "xml",
                "wxs": "xml",
                "wxl": "xml",
                "wsdl": "xml",
                "rss": "xml",
                "atom": "xml",
                "rdf": "xml",
                "xslt": "xml",
                "xsl": "xml",
                "xul": "xml",
                "xbl": "xml",
                "mathml": "xml",
                "config": "xml",
                "plist": "xml",
                "xaml": "xml",
                "php": "php",
                "php3": "php",
                "php4": "php",
                "php5": "php",
                "phtm": "php",
                "phtml": "php",
                "ctp": "php",
                "c": "clike",
                "h": "clike",
                "i": "clike",
                "cc": "clike",
                "cp": "clike",
                "cpp": "clike",
                "c++": "clike",
                "cxx": "clike",
                "hh": "clike",
                "hpp": "clike",
                "hxx": "clike",
                "h++": "clike",
                "ii": "clike",
                "ino": "clike",
                "cs": "clike",
                "asax": "clike",
                "ashx": "clike",
                "java": "clike",
                "scala": "clike",
                "sbt": "clike",
                "coffee": "coffeescript",
                "cf": "coffeescript",
                "cson": "coffeescript",
                "_coffee": "coffeescript",
                "clj": "clojure",
                "cljs": "clojure",
                "cljx": "clojure",
                "pl": "perl",
                "pm": "perl",
                "rb": "ruby",
                "ru": "ruby",
                "gemspec": "ruby",
                "rake": "ruby",
                "py": "python",
                "pyw": "python",
                "wsgi": "python",
                "sass": "sass",
                "lua": "lua",
                "sql": "sql",
                "diff": "diff",
                "patch": "diff",
                "md": "markdown",
                "markdown": "markdown",
                "mdown": "markdown",
                "mkdn": "markdown",
                "yaml": "yaml",
                "yml": "yaml",
                "hx": "haxe",
                "sh": "shell",
                "command": "shell",
                "bash": "shell"
            };

            var extension = fname.substr((~-fname.lastIndexOf(".") >>> 0) + 2);

            if (extension) {
                var editorMode = editorModeMap[extension.toLowerCase()];
                return editorMode ? editorMode : '';
            } else {
                return '';
            }
        };
    }]);

    app.filter('humanReadableFileSize', ['$filter', 'fileManagerConfig', function($filter, fileManagerConfig) {
      var decimalByteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
      var binaryByteUnits = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

      return function(input) {
      var i = -1;
      var fileSizeInBytes = input;

      do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
      } while (fileSizeInBytes > 1024);

      var result = fileManagerConfig.useBinarySizePrefixes ? binaryByteUnits[i] : decimalByteUnits[i];
        return Math.max(fileSizeInBytes, 0.1).toFixed(1) + ' ' + result;
      };
    }]);

})(angular);
