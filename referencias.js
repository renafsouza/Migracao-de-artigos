const fs = require('fs');
const pdf = require('pdf-parse');

function render_page (pageData) {
    //check documents https://mozilla.github.io/pdf.js/
    let render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace: true,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems: false
    }

    return pageData.getTextContent(render_options)
        .then(function (textContent) {
            let lastY, lastX, text = '';
            for (let item of textContent.items) {
                // console.log(item)
                if (
                    item.str == 'IX Workshop de Informática na Escola - WIE - 2003'
                    || item.str == 'Workshop em Informática na Educação  (wie) 2003'
                ) {

                } else if (
                    (Math.abs(lastY - item.transform[5]) > 15)
                    && lastY
                ) {
                    text += '\n' + item.str;
                } else {
                    text += item.str;
                }
                lastY = item.transform[5];
            }
            return text;
        });
}
fs.readdir('./pdfs', async (err, files) => {
    for ([i, file] of files.filter(f => f.includes("pdf")).entries()) {
        let dataBuffer = fs.readFileSync(`./pdfs/${file}`)
        await pdf(dataBuffer, {
            pagerender: render_page
        }).then(function (data) {
            const index = data.text.search(/Bibliografia|Bibliografía|Referências Bibliográficas|Referências/)
            if (index != -1) {
                const referencias = data.text
                    .substring(index)
                    .split('\n')
                    .filter(line => !line.match(/^[ \d]*$/) && !line.match(/^ *(Bibliografia|Bibliografía|Referências Bibliográficas|Referências) *$/))
                    .join('\n')
                    .replace(/\n/g, '\n\n')
                    .replace(/ +/g, " ")
                fs.writeFile(`./referencias/${i + 1}.csv`, referencias, null, () => { })
            }
        });
    }
})

