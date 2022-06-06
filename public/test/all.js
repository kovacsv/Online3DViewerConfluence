var AP = {
    pageId : 1,

    context : {
        getContext : () => {
            return new Promise ((resolve, reject) => {
                resolve ({
                    confluence : {
                        content : {
                            id : AP.pageId
                        }
                    }
                });
            });
        }
    },

    request : (url) => {
        if (url === '/rest/api/content/' + AP.pageId.toString () + '/child/attachment') {
            let resultJson = {
                results : [
                    {
                        title : 'hundred_cubes.obj',
                        _links : {
                            download : 'test/testfiles/hundred_cubes.obj'
                        }
                    },
                    {
                        title : 'hundred_cubes.mtl',
                        _links : {
                            download : 'test/testfiles/hundred_cubes.mtl'
                        }
                    },
                    {
                        title : 'DamagedHelmet.glb',
                        _links : {
                            download : 'test/testfiles/DamagedHelmet.glb'
                        }
                    },
                    {
                        title : 'Samba_Dancing.fbx',
                        _links : {
                            download : 'test/testfiles/Samba_Dancing.fbx'
                        }
                    },
                    {
                        title : 'nonexistingbuthasurl.ext',
                        _links : {
                            download : 'test/testfiles/nonexistingbuthasurl.ext'
                        }
                    }
                ]
            };
            return new Promise ((resolve, reject) => {
                resolve ({ body : JSON.stringify (resultJson) });
            });
        } else {
            return new Promise ((resolve, reject) => {
                fetch (url).then ((response) => {
                    return response.arrayBuffer ();
                }).then ((arrayBuffer) => {
                    resolve ({ body : arrayBuffer });
                }).catch (() => {
                    reject ();
                });
            });
        }
    }
};
