const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('19NAL52s8F1-x49hzDJozue3IUKdpnoXb0MxAopFCrno');
const fs = require('fs');
const cred = JSON.parse(fs.readFileSync('demoproject-341715-61e1e0a79879.json'));

async function getSheetReady() {
    await doc.useServiceAccountAuth({
        client_email: cred.client_email,
        private_key: cred.private_key,
      });
      
    await doc.loadInfo();
    return true
}

async function addRows(index, email, channelId, roleId) {

    const sheet = doc.sheetsByIndex[index];
    await sheet.addRow({email: email, channelId: channelId, roleId: roleId})
    // console.log('row=>', row[0].email)
    return true
}

async function getRows(index) {
    const sheet = await doc.sheetsByIndex[index];
    const row = await sheet.getRows()
    return row
}

async function findEmailId(index, email) {
    let data = await getRows(index);
    const isEmailExist = await data.findIndex(x => x.email === email)
    if (isEmailExist > -1) {
        return true
    }  else {
        return false
    }
}

async function updateDetails(index,email, channelId, roleId) {
    const sheet = await doc.sheetsByIndex[index];
    const row = await sheet.getRows()
    let data = await getRows(index)
    const dataIndex = await data.findIndex(x => x.email === email)
    row[dataIndex].channelId = channelId
    row[dataIndex].roleId = roleId
    await row[dataIndex].save();
    return true
}

async function getChannelAndRoleId(index, clan) {
    let datas =await getRows(index)
    return datas.find(x => x.clan === clan)
}

module.exports = {
    getSheetReady,
    addRows,
    getRows,
    findEmailId,
    updateDetails,
    getChannelAndRoleId
}