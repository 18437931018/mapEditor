const fs = require("fs");
const { mas } = require("process");
let rootDir = '';
let mapInfos = {};
let mapInfo = {};
let mapKey = '';
function $(v) {
    return document.getElementById(v);
}

function getImage() {
    return document.createElement("img");
}

function regisstry() {
    const dragWrapper = $("drag_test");
    dragWrapper.addEventListener("drop", (e) => {
        e.preventDefault(); //阻止e的默认行为
        const files = e.dataTransfer.files;
        if (files && files.length >= 1) {
            const path = files[0].path;
            rootDir = path.replace('maps.json', '');
            dragWrapper.style.display = "none";
            console.log("file:", path);
            const content = fs.readFileSync(path);
            mapInfos = JSON.parse(content);
            creatSelect();
        }
    })
    //这个事件也需要屏蔽
    dragWrapper.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
};
regisstry();

function creatSelect() {
    const items = Object.keys(mapInfos);
    let htmls = `<select id='SelectComp'>`;
    items.sort();
    items.forEach(v => {
        htmls += `<option>${v}</option>`
    });
    htmls += `</select>`;
    htmls += `<button type="button" onClick="viewMap()">Click Me!</button>`;
    htmls += `<button type="button" onClick="viewMap2()">隐藏上层</button>`;
    $("select").innerHTML = htmls;
}


function viewMap() {
    const object = $("SelectComp");
    const selectedIndex = object.selectedIndex;
    const val = object.options[selectedIndex].value;
    mapKey = val;
    mapInfo = mapInfos[mapKey];
    createMap();
}

function viewMap2() {
    let mapView2 = $('map2');
    mapView2.style.display = 'none';
}

function createMap() {

    let mapViews = $('maps');
    // mapViews.innerHTML = "";
    mapViews.style.display = 'block';
    mapViews.style.width = mapInfo.pixWidth + 'px';
    mapViews.style.height = mapInfo.pixHeight + 'px';


    let mapView = $('map');
    mapView.innerHTML = "";
    mapView.style.display = 'block';
    mapView.style.width = mapInfo.pixWidth + 'px';
    mapView.style.height = mapInfo.pixHeight + 'px';

    let mapView2 = $('map2');
    mapView2.innerHTML = "";
    mapView2.style.display = 'block';
    mapView2.style.width = mapInfo.pixWidth + 'px';
    mapView2.style.height = mapInfo.pixHeight + 'px';



    let imgSize = 256;
    let turn = 0;

    let ww = mapInfo.pixWidth;
    let hh = mapInfo.pixHeight;

    let imgX = 0;
    let imgY = 0;

    let imgXCount = imgX + Math.floor(ww / imgSize) + 2;
    let imgYCount = imgY + Math.floor(hh / imgSize) + 2;
    let maxImagX = Math.floor(ww / imgSize);
    let maxImagY = Math.floor(hh / imgSize);


    let _numRows = mapInfo.maxY;
    let _numCols = mapInfo.maxX;
    let _nodes = [];
    let node = {};
    for (let i = 0; i < _numCols; i++) {
        _nodes[i] = [];
        for (let j = 0; j < _numRows; j++) {
            node = {};
            node.flags = mapInfo.grids[i * _numRows + j];
            _nodes[i][j] = node;
        }
    }

    if (turn) {
        for (let i = imgX; i <= imgXCount && i < maxImagX; i++) {
            let index = maxImagX - i > 0 ? maxImagX - i - 1 : 0;
            for (let j = imgY; j <= imgYCount && j < maxImagY; j++) {

                let sourceName = `${rootDir}${mapKey}/image/${j}_${index}.jpg`;
                let s = getImage();
                s.scr = fs.readFileSync(sourceName).toString();
                s.style.x = (i + 1) * imgSize;
                s.style.y = j * imgSize;
                mapView.appendChild(s);

            }
        }
    } else {
        for (let i = imgX; i <= imgXCount && i < maxImagX; i++) {
            for (let j = imgY; j <= imgYCount && j < maxImagY; j++) {
                let sourceName = `${rootDir}${mapKey}/image/${j}_${i}.jpg`;


                fs.readFile(sourceName, (err, data) => {
                    var file = new File([data], 'AnyName.jpg', { type: 'image/jpg' });
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        var newUrl = this.result;
                        let s = getImage();
                        s.style.position = 'absolute';
                        s.src = newUrl;
                        s.style.left = i * imgSize + 'px';
                        s.style.top = j * imgSize + 'px';
                        mapView.appendChild(s);
                    };
                });



            }
        };

        _nodes.forEach((v, i) => {
            v.forEach((v2, j) => {
                let mask = createMask(_nodes[i][j].flags);
                mask.style.left = i * mapInfo.title_wh + 'px';
                mask.style.top = j * mapInfo.title_wh + 'px';
                mapView2.appendChild(mask);
            })
        })

    }


}

function createMask(type) {
    let mask = document.createElement("div");
    mask.style.width = mapInfo.title_wh + 'px';
    mask.style.height = mapInfo.title_wh + 'px';
    mask.style.position = 'absolute';
    mask.style.opacity = 0.2;
    let co = 'yellow';
    if (type == 1) {
        co = 'green';
    } else if (type == 3) {
        co = 'orange';
    };
    mask.style.backgroundColor = co;
    return mask;
}

