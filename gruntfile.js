var serveStatic=require('serve-static');
function mountFolder (connect, alias,dir) {
    var y=require('path').resolve(dir);                  //chemin local du dossier
    return connect().use("/"+alias,serveStatic(y));      //associe localhost:port/alias au chemin local du dossier

}

module.exports=function(grunt){

    grunt.initConfig({
        qunit:{
            options: {
                'phantomPath': 'node_modules/phantomjs/bin/phantomjs',
                timeout:20000
            },
            test: {
                options: {
                    urls: ['http://127.0.0.1:<%= connect.testcoverage.options.port %>/test/cobra_test.html',
                        'http://127.0.0.1:<%= connect.testcoverage.options.port %>/test/event_test.html',
                        'http://127.0.0.1:<%= connect.testcoverage.options.port %>/test/user_test.html',
                        'http://127.0.0.1:<%= connect.testcoverage.options.port %>/test/message_test.html',
                        'http://127.0.0.1:<%= connect.testcoverage.options.port %>/test/friend_event_cobra_test.html']
                }
            }
        },
        connect:{
            testcoverage: {
                options: {
                    port: 9002,
                    hostname: '127.0.0.1',
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'src','.tmp/src'), //remplacer les src originales avec les src instrumentées se trouvant en .tmp/src
                            mountFolder(connect, 'test','test'),    //lier les tests
                            mountFolder(connect, 'lib', 'lib')     //indiquer autant de dossiers externes (libs, autres) nécessaires
                        ]
                    }
                }
            }
        },
        coverageInstrument: {
            test: {
                src: 'src/*.js',
                expand: true,
                cwd: '.',           //chemin de référence / home directory
                dest: '.tmp'        //les sources instrumentées se retrouveront dans .tmp/src
            }
        },
        makeReport: {
            src: '.tmp/*.json',
            options: {
                type: 'lcov',
                dir: '.tmp/coverage/reports',
                print: 'detail'
            }
        }
    });
    grunt.loadNpmTasks('serve-static');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-croc-qunit');
    grunt.registerTask('default', [ 'coverageInstrument','connect:testcoverage','qunit','coverageReport','makeReport']);
};