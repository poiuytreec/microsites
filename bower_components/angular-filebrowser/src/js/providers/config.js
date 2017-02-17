(function(angular) {
    "use strict";
    angular.module('FileManagerApp').provider("fileManagerConfig", function() {

        var values = {
            appName: "AgaveTo Data Explorer",
            defaultLang: "en",

            listUrl: "",
            uploadUrl: "",
            renameUrl: "",
            copyUrl: "",
            removeUrl: "",
            editUrl: "",
            getContentUrl: "",
            createFolderUrl: "",
            downloadFileUrl: "",
            compressUrl: "",
            extractUrl: "",
            permissionsUrl: "",

            sidebar: true,
            breadcrumb: true,
            allowedActions: {
                rename: true,
                copy: true,
                edit: true,
                changePermissions: true,
                compress: true,
                compressChooseName: true,
                extract: false,
                download: true,
                preview: true,
                remove: true,
                postits: true,
                publish: false,
                notifications: true
            },

            enablePermissionsRecursive: true,
            compressAsync: true,
            extractAsync: true,
            isEditableFilePattern: /\.(txt|html?|aspx?|ini|pl|py|md|css|js|log|htaccess|htpasswd|json|sql|xml|xslt?|sh|rb|as|bat|cmd|coffee|php[3-6]?|java|c|cbl|go|h|scala|vb|md|err|out|scala|groovy|zsh|csh|pub|agave|csv|dat|fasta|pdb|properties|tsv|yml)$/i,
            isPreviewableFilePattern: /\.(txt|html?|aspx?|ini|pl|py|md|css|js|log|htaccess|htpasswd|json|sql|xml|xslt?|sh|rb|as|bat|cmd|coffee|php[3-6]?|java|c|cbl|go|h|scala|vb|md|err|out|scala|groovy|zsh|csh|jpe?g|gif|bmp|png|pdf|svg||agave|csv|dat|fasta|pdb|properties|tsv|yml|^([^.]+)|tiff?)$/i,
            isTextFilePattern: /\.(json|err|out|m|tex|sh|log|txt|tcl)$/i,
            isImageFilePattern: /\.(jpe?g|gif|bmp|png|svg|tiff?)$/i,
            isExtractableFilePattern: /\.(gz|tar|rar|g?zip)$/i,
            isPdfFilePattern: /\.pdf$/i,

            tplPath: '../bower_components/angular-filebrowser/src/templates'
        };

        return {
            $get: function() {
                return values;
            },
            set: function (constants) {
                angular.extend(values, constants);
            }
        };

    });
})(angular);
