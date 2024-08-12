var dosieroNomo
var dosieroNomoVojo
// ฟังก์ชันดึงไฟล์ XML
function loadXML() {
    dosieroNomo = document.getElementById("xmlPath").value.trim()  + ".xml";
    dosieroNomoVojo = "./XML/" + dosieroNomo;

    console.log(dosieroNomo);
    if (dosieroNomo === "") {
        alert("La vojo de la dosiero estas malĝusta!");
        return;
    }

    fetch(dosieroNomoVojo)
        .then(response => {
            if (!response.ok) {
                throw new Error('La reto estas malbona!');
            }
            return response.text();
        })
        .then(xmlText => {
            displayXML(xmlText);
        })
        .catch(error => {
            console.error('estas ia problemo!', error);
        alert("ne estas la vorto!");
        });
}

// ฟังก์ชันแสดง XML ในรูปแบบข้อความ
// โดยการเปลี่ยน XML ของ Reta Vortaro เป็น tag ของ html
function displayXML(xmlText) {
    document.getElementById("xmlContent").innerHTML = xmlText
    .replace(/<\/drv>/g, "</drv><br><br><hr>")
    .replace(/<\/uzo>/g, "</uzo><hr>")
    //tradukoj
    .replace(/<trd lng=\"en\">/g, "<trd lng=\"en\"> 🇬🇧:")
    .replace(/<trdgrp lng=\"en\">/g, "<trdgrp lng=\"en\"> 🇬🇧:")
    //ekzemplo
    .replace(/<ekz>/g, "📖<ekz> ")
    .replace(/<\/ekz>/g, "</ekz><hr>")
    //scienca nomo
    .replace(/<trd lng=\"la\">(.*)<\/trd>/g, "<i>$1</i>")
    //fnt (fontoj)
    .replace(/<fnt>/g, "<small><i>")
    .replace(/<\/fnt>/g, "</i></small>")
    //kapvorto
    .replace(/<\/kap>/g, "</kap><br>")
    .replace(/(<kap><rad>[a-z].*<\/rad>\/[a-z].*)<\/kap>/gm, "<span id=\"kapvorto\">$1</span>")
    //preni la literojn kaj emfazi la vorton tajpitan
    .replace(/<tld\/>/g, "<u>" + dosieroNomo.slice(0, dosieroNomo.length - 4) + "</u>")
    //por la vortoj,kiuj komenciĝas per granda litero
    .replace(/<tld lit=\"(.)\"\/>/g, "<u>$1" + dosieroNomo.slice(1, dosieroNomo.length - 4) + "</u>")
    //aldoni etikedon "name"
}
//กด Enter เพื่อรัน loadXML
document.addEventListener('keydown', e => {
    if (e.code === "Enter") {
        loadXML()
        document.getElementById("vortoj").innerHTML = ""
    }
})
tujaVorto() 

//ฟังก์ชันแสดงข้อความ live search
//โดยนำข้อมูลจากช่อง input มาค้นหาคำ
function tujaVorto(v) {
    cxiuj_vortoj = cxiuj_vortoj.replace(/\.0/g, "")
    .replace(/0/g, "")
    // abism(.en0)igxi
    cxiuj_vortoj = cxiuj_vortoj.replace(/([a-z]*)\.([a-z]*)([a-z]{1})/g, "$2$1$3")
    cxiuj_vortoj = cxiuj_vortoj.replace(/(xm)([a-z]*)([l]{1})/g, "$2.$1$3")
    cxiuj_vortoj = cxiuj_vortoj.replace(/( [a-z]*)\.(.*)0(.*$)/gm, "$2$1$3").replace(/ /g,"")
    // console.log(v);
    // console.log(cxiuj_vortoj);
    let sercxantaVorto = document.getElementById("xmlPath").value.trim()

    const cxiuj_vortoj_arr = cxiuj_vortoj.split(/\n/g)
    // console.log(cxiuj_vortoj_arr);

    if (sercxantaVorto.length > 0) {
        let sxablono_regex = new RegExp(`(${(sercxantaVorto)})`, "gm");
        let rezulto = cxiuj_vortoj_arr.filter(function(str) {
        //test() ส่งค่าเป็น boolean สำหรับการตรวจสอบการค้นหา
        return sxablono_regex.test(str);
    });
        // console.log(rezulto);
        const aldoni_ion_al_rezulto = rezulto.join(" + ")
        document.getElementById("vortoj").innerHTML = aldoni_ion_al_rezulto.toString()
        //,palinu.xml
        .replace(/\+/gm, "<br><hr>")
        //ĉapelitaj malgrandaj literoj
        .replace(/hx/g, "ĥ")
        .replace(/sx/g, "ŝ")
        .replace(/gx/g, "ĝ")
        .replace(/cx/g, "ĉ")
        .replace(/jx/g, "ĵ")
        //ĉapelitaj grandaj literoj
        .replace(/HX/g, "Ĥ")
        .replace(/SX/g, "Ŝ")
        .replace(/GX/g, "Ĝ")
        .replace(/CX/g, "Ĉ")
        .replace(/JX/g, "Ĵ")
        .replace(/([a-z0-9]*)\.xml/g, "<u><span onclick=\"vorto(this.innerText)\">$1</span></u>") + "<hr><hr>"
    } else if (sercxantaVorto.length < 1) {
        document.getElementById("vortoj").innerHTML = ""
    }
    }

    //ฟังก์ชันดึงคำจาก live search ไปสร้าง Path ของ XML ในฟังก์ชัน loadXML() 
    function vorto(vorto) {
        document.getElementById("xmlPath").value = vorto
        loadXML()
        //และลบตัวข้อความของ live search
        document.getElementById("vortoj").innerHTML = ""
    }