const fs = require('fs');
const pdf = require('pdf-parse');

fs.readdir('./pdfs', async (err, files) => {
    for ([i, file] of files.filter(f => f.includes("pdf")).entries()) {
        let dataBuffer = fs.readFileSync(`./pdfs/${file}`)
        await pdf(dataBuffer).then(function (data) {
            let emails = data.text.match(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/g)
            for (email of emails || [])
                console.log(i + 1, email)
            emails = data.text.match(/{([\w-\.,]+)}+@([\w-]+\.)+[\w-]{2,4}/g)
            for (email of emails || []) {
                let [emails, domain] = email.split("@")
                for (email of emails.replace(/[{}]/g, "").split(","))
                    console.log(i + 1, `${email}@${domain}`)
            }
        });
    }
})

