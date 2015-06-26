'use strict';

describe('Services', function () {
    beforeEach(module('vgApp'));

    it('logParser should parse a log row and return structured data', function () {
        inject(function (logParser) {
            var expects = {
                '85.164.152.30 - - [23/May/2012:14:01:05 +0200] "GET http://www.vgtv.no/video/img/94949_160px.jpg HTTP/1.1" 200 3889 "http://www.vgtv.no/" "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:12.0) Gecko/20100101 Firefox/12.0"': {
                    ip: '85.164.152.30',
                    date: '23/May/2012:14:01:05 +0200',
                    method: 'GET',
                    url: 'http://www.vgtv.no/video/img/94949_160px.jpg',
                    host: 'www.vgtv.no',
                    uri: '/video/img/94949_160px.jpg'
                }
            };

            for (var row in expects) {
                expect(logParser.parseRow(row)).toEqual(expects[row]);
            }
        });
    });
});
