import * as OV from 'online-3d-viewer';

OV.SetExternalLibLocation ('build/libs');

window.onload = function () {
    let contentDiv = document.getElementById ('content');
    contentDiv.innerHTML = window.location.search;
} ;
