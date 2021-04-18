function getCommentList() {
    const resultDispId = 'note_result';
    const api_key = 'AKfycbxffPZtMtem2fAhAhG8HCejVjG9rPudtWS5JmOnyJlb5lkTLgEQlXJ9FmRDbN6ykKI';
    let req = new XMLHttpRequest();
    let form = document.getElementById('setting');
    let url = 'https://script.google.com/macros/s/' + api_key +
        '/exec?note=' + form.note_url.value;
    let isJson = form.note_json.checked;

    //テーブルをクリア＆フォームをロック
    document.getElementById(resultDispId).innerHTML = 'しばらく時間がかかります。。。';
    setFormDisabled(true);

    req.open("GET", url, true);
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            //ロックを解除
            setFormDisabled(false);
            if (req.status == 200) {
                //結果を出力
                drawTable(req.responseText, resultDispId, isJson);
            } else {
                drawTable('', resultDispId, isJson);
            }
        }
    };
    req.send(null);
}

function setFormDisabled(lock) {
    document.getElementById('note_exe').disabled = lock;
    document.getElementById('note_url').disabled = lock;
}

function drawTable(jasons, elementId, isJson) {
    let obj;
    let html = '';

    if (jasons == '"error"' || jasons == '') {
        document.getElementById(elementId).innerHTML = '情報を取得できませんでした。';
    } else {
        if (isJson) {
            // JSONのまま表示
            document.getElementById(elementId).innerHTML = '<span class="note_data_json">' + jasons + '</span>';
        } else {
            obj = JSON.parse(jasons);
            html = '<table class="note_list"><tr><th>#</th><th>ID / なまえ</th></tr>'
            for (let i = 0; i < obj.length; i++) {
                let date = new Date(obj[i].date);
                let userUrl = obj[i].id;
                if (obj[i].id.substr(0, 4) != 'http') {
                    userUrl = 'https://note.com/' + userUrl;
                }
                html += '<tr><td class="note_data_id">' +
                    (i + 1) + '</td><td>' +
                    '<a href="' + userUrl + '" target="_blank">' +
                    obj[i].id + '</a><br><div class="note_data_name">' +
                    obj[i].name + '</div><div class="note_data_name">' +
                    date.toLocaleDateString() + ' ' +
                    date.toLocaleTimeString() + ' (' + obj[i].comment + ') </div></td></tr>';
            }
            html += '</table>';

            document.getElementById(elementId).innerHTML = html;
        }
    }
}