function GetAttachmentDownloadUrls (attachmentNames)
{
    return new Promise ((resolve, reject) => {
        AP.context.getContext ().then ((response) => {
            let pageId = response.confluence.content.id;
            return AP.request ('/rest/api/content/' + pageId + '/child/attachment');
        }).then ((response) => {
            let contents = JSON.parse (response.body);
            let attachmentUrls = [];
            for (let attachmentIndex = 0; attachmentIndex < contents.results.length; attachmentIndex++) {
                let attachment = contents.results[attachmentIndex];
                let foundAttachmentNameIndex = attachmentNames.indexOf (attachment.title);
                if (foundAttachmentNameIndex !== -1) {
                    attachmentUrls.push ({
                        name : attachment.title,
                        url : attachment._links.download
                    });
                }
            }
            resolve (attachmentUrls);
        });
    });
}

function GetAttachmentFileObject (attachmentUrl)
{
    return new Promise ((resolve, reject) => {
        AP.request (attachmentUrl.url, {
            binaryAttachment: true
        }).then ((data) => {
            let fileObject = new File ([new Blob ([data.body])], attachmentUrl.name);
            resolve (fileObject);
        }).catch (() => {
            reject ();
        });
    });
}

export function GetAttachmentFileObjects (attachmentNames)
{
    return new Promise ((resolve, reject) => {
        GetAttachmentDownloadUrls (attachmentNames).then ((attachmentUrls) => {
            let getObjectHandlers = [];
            for (let attachmentIndex = 0; attachmentIndex < attachmentUrls.length; attachmentIndex++) {
                let attachmentUrl = attachmentUrls[attachmentIndex];
                getObjectHandlers.push (GetAttachmentFileObject (attachmentUrl));
            }
            if (getObjectHandlers.length > 0) {
                Promise.all (getObjectHandlers).then ((fileObjects) => {
                    resolve (fileObjects);
                }).catch (() => {
                    reject ();
                });
            } else {
                reject ();
            }
        });
    });
}
