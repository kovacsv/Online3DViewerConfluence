import { GetAttachmentFileObjects } from './confluence.js';

import * as OV from 'online-3d-viewer';

function ProcessUrlParameters (url)
{
    let urlParams = new URLSearchParams (url);

    let modelFileNames = [];
    let fileParamNames = ['file1', 'file2', 'file3', 'file4', 'file5'];
    for (let i = 0; i < fileParamNames.length; i++) {
        let fileParamName = fileParamNames[i];
        let param = urlParams.get (fileParamName);
        if (param !== null && param.length > 0) {
            modelFileNames.push (param);
        }
    }

    let params = {
        modelFileNames : modelFileNames,
        canvasWidth : urlParams.get ('canvaswidth'),
        canvasHeight : urlParams.get ('canvasheight'),
        backgroundColor : urlParams.get ('backgroundcolor'),
        defaultColor : urlParams.get ('defaultcolor')
    };

    return params;
}

function OnModelFilesLoaded (parameters, fileObjects)
{
    OV.SetExternalLibLocation ('build/libs');

    let backgroundColor = new OV.RGBAColor (255, 255, 255, 0);
    if (parameters.backgroundColor.length == 6) {
        backgroundColor = OV.HexStringToRGBAColor (parameters.backgroundColor);
    }
    let defaultColor = new OV.RGBColor (200, 200, 200);
    if (parameters.defaultColor.length == 6) {
        defaultColor = OV.HexStringToRGBColor (parameters.defaultColor);
    }

    let contentDiv = document.getElementById ('content');
    let viewer = new OV.EmbeddedViewer (contentDiv, {
        backgroundColor : backgroundColor,
        defaultColor : defaultColor,
        environmentSettings : new OV.EnvironmentSettings (
            [
                'build/envmaps/fishermans_bastion/posx.jpg',
                'build/envmaps/fishermans_bastion/negx.jpg',
                'build/envmaps/fishermans_bastion/posy.jpg',
                'build/envmaps/fishermans_bastion/negy.jpg',
                'build/envmaps/fishermans_bastion/posz.jpg',
                'build/envmaps/fishermans_bastion/negz.jpg'
            ],
            false
        )
    });

    let scale = window.devicePixelRatio || 1.0;
    viewer.canvas.width = contentDiv.clientWidth * scale;
    viewer.canvas.height = contentDiv.clientHeight * scale;

    viewer.LoadModelFromFileList (fileObjects);
}

function OnWindowLoaded ()
{
    let parameters = ProcessUrlParameters (window.location.search);

    let contentDiv = document.getElementById ('content');
    contentDiv.style.width = parameters.canvasWidth;
    contentDiv.style.height = parameters.canvasHeight;

    let progressBar = document.createElement ('div');
    progressBar.innerHTML = 'Downloading attachments...';
    contentDiv.appendChild (progressBar);

    GetAttachmentFileObjects (parameters.modelFileNames).then ((attachmentFileObjects) => {
        contentDiv.removeChild (progressBar);
        OnModelFilesLoaded (parameters, attachmentFileObjects);
    }).catch (() => {
        progressBar.innerHTML = 'Failed to download attachments.'
    });
}

window.addEventListener ('load', () => {
    OnWindowLoaded ();
});
