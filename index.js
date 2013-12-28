/******
* TODO : mvc 건 뭐건 어쨋든 '분리'.. 객체지향................
* id별로 정보를 관리하는 db가 있고, httpRequest(someName.php) 같은걸로 그 디비에 정보를 추가, 삭제, 그리고 당연히 불러올 수 있도록.
* 그래서 받은 정보를 인자로 넘기면 element로 만들고, 배치하도록. 또, element를 resizable하도록(responsive!).
* 그리고 element 를 인자로 넘겨서 걔네를 클릭하면가운데로배치하게, 마우스올리면키워서내용더보이게, 키보드입력도받게, 추가.
* 이걸 managing 하는 main함수등을 만들어야.
******/
/*****
* 그리고 나중에는 한 눈에 다 보여주는 기능도 추가.
* <ol>,<li>tag 써서 처리. 해당 번호를 키보드로 누르면 클릭과 같은 효과.
* html 파일로 내보내주고 읽는것도 추가.
*****/

ColorList = ["#F38630", "#69D2E7", "#E0E4CC", "#FA6900", "#A7DBD8"];
BackgroundList = [
"http://colourlovers.com.s3.amazonaws.com/images/patterns/3822/3822133.png?1377093078",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/3816/3816031.png?1376890972",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/582/582552.png?1250954754",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/328/328710.png?1332797054",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/1101/1101098.png?1287436878",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/89/89366.png?1321378552",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/1181/1181271.png?1291485803",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/1684/1684015.png?1312140286",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/2290/2290455.png?1335954364",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/1631/1631873.png?1340389562",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/1462/1462099.png?1352412939",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/2340/2340229.png?1332799455",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/2445/2445745.png?1335447079",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/2639/2639257.png?1340222595",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/2168/2168138.png?1328143893",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/3898/3898458.png?1380324096",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/3396/3396019.png?1361211310",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/1776/1776807.png?1353263169",
"http://colourlovers.com.s3.amazonaws.com/images/patterns/3878/3878314.png?1379402588"
];

////////////////// Adding Nodes to Array //////////////////

Contents = {'NodeCnt':0};

Contents['Empty'] = {'Exclude':true, 'Content':''};
Contents['None'] = {'Exclude':true, 'Content':'<object data="http://postfiles14.naver.net/20131101_45/pztclagk_1383280808251QSDVL_PNG/10.png?type=w1" type="image/png"> <object data="res/onDogFoot.png" type="image/png" style="margin-top:-20px;margin-left:-20px;"> <span style="font-size:2em;">졸려</span> </object> </object>'};
Contents['Add'] = {'Exclude':true, 'Content':'<span style="font-size:5em; color:gray;">+</span>'};
Contents['Adding'] = {'Exclude':true, 'Content':'<Input id="AddInput" type="text" value=""><br><Input id="AddButton" type="button" value="Add"><br><Input id="BackButton" type="button" value="Back">'};
Contents['Node0'] = {'Exclude':true, 'Content':'Heesu', 'Depth':0, 'Parent':null, 'Child':[]};
console.log("Contents : ");
console.log(Contents);

function AddChildNode(NodeObj, Parent, Content) {
	// 나중에 error 처리를 위해 (예외처리에 관한)if 문을 따로 둠. 일단은 console 창에서 찍는 걸로.
	if (!Parent) { console.log("AddChildNode : No Parent Input"); return; }
	if (typeof NodeObj[Parent] === "undefined") { console.log("AddChildNode : Parent undefined"); return; }
	var Name = Parent+'-'+NodeObj[Parent].Child.length;

	var newNode = {};
	newNode.Content = (Content) ? Content : Name;
	newNode.Depth = NodeObj[Parent].Depth + 1;
	newNode.Parent = Parent;
	newNode.Child = [];

	console.log("Pushing "+Name+" to "+Parent);
	NodeObj[Parent].Child.push(Name);

	NodeObj[Name] = newNode;
	NodeObj['NodeCnt']++;
}

// test 용으로 hard coding.
// file IO 를 배워서, 현재 파일이 존재하는 서버에 로그인정보를 받고, 아이디명.txt 파일에 xml 식으로 저장하면..... 되지 않을 까.........
AddChildNode(Contents, 'Node0');
AddChildNode(Contents, 'Node0');
AddChildNode(Contents, 'Node0');
AddChildNode(Contents, 'Node0-1');
AddChildNode(Contents, 'Node0-1');
AddChildNode(Contents, 'Node0-1');
AddChildNode(Contents, 'Node0-2');
AddChildNode(Contents, 'Node0-2');
AddChildNode(Contents, 'Node0-2');
AddChildNode(Contents, 'Node0-2');
AddChildNode(Contents, 'Node0-2');
AddChildNode(Contents, 'Node0-2-1');
AddChildNode(Contents, 'Node0-2-1');
AddChildNode(Contents, 'Node0-2-1');
AddChildNode(Contents, 'Node0-2-1');
AddChildNode(Contents, 'Node0-2-1');
AddChildNode(Contents, 'Node0-2-1');

console.log(Contents);



////////////////// Positioning Nodes to HTML //////////////////

function ChangeMain(NodeObj, MainName, ChildNameArray, bShuffleChild, bAddable) {
	document.getElementById('wrap').innerHTML = "";
	if (!MainName) { console.log("ChangeMain : No MainName Input"); return; }
	if (typeof NodeObj[MainName] === "undefined") { console.log("ChangeMain : MainName undefined"); return; }

	console.log("Creating Main");
	var MainElement = GetNewNodeElement(NodeObj, MainName, 'Main', ColorList);
	document.getElementById('wrap').appendChild(MainElement);

	if(MainName === 'Adding') return;
	if (!ChildNameArray) ChildNameArray = NodeObj[MainName].Child | [];
	if (!ChildNameArray) ChildNameArray = NodeObj[MainName].Child;
	if (bShuffleChild===true) ChildNameArray = GetShuffledArray(ChildNameArray);

	var ChildElementArray = [];
	for (var i = 0; i < ChildNameArray.length; i++) {
		console.log("Creating Child "+i);
		ChildElementArray[i] = GetNewNodeElement(NodeObj, ChildNameArray[i], 'Child Clickable', ColorList);
		document.getElementById('wrap').appendChild(ChildElementArray[i]);
	}

	// 항상 들어가는 것들. (add, root, parent).
	// 부모 노드를 배열의 맨 앞에 넣는다.
	if (NodeObj[MainName].Parent) {
		ChildElementArray.unshift(GetNewNodeElement(NodeObj, NodeObj[MainName].Parent, 'Parent Clickable', ColorList));
		document.getElementById('wrap').appendChild(ChildElementArray[0]);
	}

	// 추가 노드를 배열에 넣는다.
	if (bAddable===true) {
		ChildElementArray.push(GetNewNodeElement(NodeObj, 'Add', 'Add', ColorList));
		document.getElementById('wrap').appendChild(ChildElementArray[ChildElementArray.length-1]);
	}

	// 루트 노드는 항상 배열에 넣는다. 단, 부모가 있을 때는 순서가 맨 뒤.
	// !!!!!! (루트 이름이 'Node0'이라는 가정이 들어 감)
	if (NodeObj[MainName].Parent != 'Node0' && MainName!='Node0') {
		if (NodeObj[MainName].Parent) {
			// 'Parent'라는 클래스 일단 없앰. 모두 Child 취급하기로.
			ChildElementArray.push(GetNewNodeElement(NodeObj, 'Node0', 'Parent Clickable', ColorList));
			document.getElementById('wrap').appendChild(ChildElementArray[ChildElementArray.length-1]);
		} else {
			// 'Parent'라는 클래스 일단 없앰. 모두 Child 취급하기로.
			ChildElementArray.unshift(GetNewNodeElement(NodeObj, 'Node0', 'Parent Clickable', ColorList));
			document.getElementById('wrap').appendChild(ChildElementArray[0]);
		}
	}

	var LongerWidth = (document.getElementsByClassName('Main')[0].offsetWidth > document.getElementsByClassName('Main')[0].offsetHeight) ? document.getElementsByClassName('Main')[0].offsetWidth : document.getElementsByClassName('Main')[0].offsetHeight;
	MakeCircle(ChildElementArray, LongerWidth*0.5);

	MakeNodesClickable();
}

function GetNewNodeElement(NodeObj, Name, ClassType, ColorArray) {
	// createDocumentFragment() ?????????? 가 나은가.
	var Element = document.createElement('div');
	Element.id = Name;
	Element.className = 'Node ';
	if (ClassType) Element.className += ClassType+' ';
	if (NodeObj[Name].Content) Element.innerHTML = NodeObj[Name].Content;
	// depth 를 설정안하면 배경 설정도 안 해주게.
	if (NodeObj[Name].Depth || NodeObj[Name].Depth===0) {
		if (ColorArray) Element.style.backgroundColor = ColorArray[NodeObj[Name].Depth % ColorArray.length];
	} else {
		Element.style.boxShadow = "0 0";
	}
	console.log(Element);
	// appendChild 도 공통된 행위라 GetNewNodeElement 에 묶을까 했으나, 받아서 직접 넣는 게 사용자 입장에서 맞는 것 같아서 일부러 뺌. 마치 new 로 받아오면 AddChild 는 직접 해 줘야 하듯이 헣헣
	// document.getElementById('wrap').appendChild(Element);
	return Element;
}

function MakeCircle(ElementArray, ParentRadius, MarginRadius) {
	// referenced : http://hugogiraudel.com/2013/04/02/items-on-circle/
	///// 개선 필요 .. 반지름이 미묘하게 안 맞음 ㅜㅜ 노드가 여러개일 땐 별로 티가 안 나는데, 3개 정도일 때 치명적 ㅜㅜ /////
	console.log("Circle Start");
	for (var i=0; i<ElementArray.length; i++) {
		// += 이 안 됨 ㅜㅜ : Uncaught SyntaxError: Unexpected token += 

		var Degree = (270 + i * 360 / ElementArray.length) % 360;
		
		var Radius = ParentRadius;
		if (MarginRadius||MarginRadius===0) {
			Radius += MarginRadius;
		} else {
			// 가로, 세로 중 더 긴 반지름 채택.
			Radius += ( ElementArray[i].offsetWidth > ElementArray[i].offsetHeight ) ? ElementArray[i].offsetWidth*0.5 : ElementArray[i].offsetHeight*0.5;
		}
		
		console.log("Circle "+i);
		console.log("Degree : "+Degree);
		console.log("Radius : "+Radius);

		var styleInfo = document.defaultView.getComputedStyle(ElementArray[i]);
		ElementArray[i].style.transform = "rotate("+Degree+"deg) translate("+Radius+"px) rotate(-"+Degree+"deg)" + styleInfo.transform;
		ElementArray[i].style.webkitTransform = "rotate("+Degree+"deg) translate("+Radius+"px) rotate(-"+Degree+"deg)" + styleInfo.webkitTransform;
		// ElementArray[i].style.webkitTransform = "matrix(1,0,0,1,"+Math.cos(Degree*Math.PI/180)+","+Math.sin(Degree*Math.PI/180)+")" + styleInfo.webkitTransform;
		// ElementArray[i].style.webkitTransform = "rotate("+Degree+"deg) translate("+Radius+"px) rotate(-"+Degree+"deg)";
	}
}




////////////////// Selecting Random Nodes for Initial Loading //////////////////

function GetRandomNodeNameArray(NodeObj, howMany, ExcludeArray) {
	
	var NameArray = [];
	for (var name in NodeObj) {
		NameArray.push(name);
	}

	if (!ExcludeArray) return GetShuffledArray(NameArray).splice(0, howMany);

	////// Excluding Elements /////
	// howMany 값이 너무 큰지 조사하고 로그 출력. 하지만 종료시키진 않음. 돌아가긴 한다, 기대한 것보다 적은 개수가 반환될 수 있긴 하지만.
	if (NameArray.length - ExcludeArray.length < howMany) { console.log("GetRandomNodeNameArray : howMany is too large."); }

	NameArray = GetShuffledArray(NameArray);

	for (var i = 0; i < ExcludeArray.length; i++) {
		var index = NameArray.indexOf(ExcludeArray[i]);
		if (index >= 0) {
			var removed = NameArray.splice(index, 1);
			console.log("Removed "+removed);
		}
	}

	return NameArray.splice(0, howMany);
}

// referenced : http://stackoverflow.com/questions/3718282/javascript-shuffling-objects-inside-an-object-randomize/
function GetShuffledArray(sourceArray) {
    for (var n = 0; n < sourceArray.length - 1; n++) {
        var k = n + Math.floor(Math.random() * (sourceArray.length - n));

        var temp = sourceArray[k];
        sourceArray[k] = sourceArray[n];
        sourceArray[n] = temp;
    }
    return sourceArray;
}

function Init(n, NodeObj, main, bgArray) {
	if (!NodeObj) NodeObj = Contents;
	if (!n) {n = 6;}
	if (!main) main = 'None';
	if (NodeObj['NodeCnt'] < n) n = NodeObj['NodeCnt'];
	if (!bgArray) bgArray = BackgroundList;

	var ExcludeNodeNameArray = ['NodeCnt'];
	for (var i in NodeObj) {
		if (NodeObj[i].Exclude === true) ExcludeNodeNameArray.push(i);
	}
	if (main && ExcludeNodeNameArray.indexOf(main) == -1) ExcludeNodeNameArray.push(main);
	console.log('Will Exclude : ');
	console.log(ExcludeNodeNameArray);

	var ChildNodeNameArray = [];
	
	ChildNodeNameArray = ChildNodeNameArray.concat(GetRandomNodeNameArray(NodeObj, n, ExcludeNodeNameArray));
	console.log('Initial Display : ');
	console.log(ChildNodeNameArray);
	ChangeMain(NodeObj, main, ChildNodeNameArray);

	var ChildNodes = document.getElementsByClassName('Child');
	for (var i = 0; i < ChildNodes.length; i++) {
		var RGB = document.defaultView.getComputedStyle(ChildNodes[i]).backgroundColor.match(/(\d+)/g);
		ChildNodes[i].style.backgroundColor = "rgba("+RGB[0]+","+RGB[1]+","+RGB[2]+","+0.3+")";
	}

	var randNum = Math.floor(Math.random() * bgArray.length);
	document.getElementById('bg').style.backgroundImage="url("+bgArray[randNum]+")";
}

function ResizeNodes() {
	// 귀찮다 나중에 해야지
	// --> if
	// 윈도우 크기가 (x, y) 둘 중 하나라도 500(메인+자식들 이 이루는 큰 원의 직경)보다 작아지면,
	// 'Wrap'에 scale을 곱해서 전체 크기를 줄여버리자.......?
	// --> else
	// 근데 다시 커지면 500 까지만 돌려놔야 ....?
}

window.addEventListener('load', function(e){Init();}, false);
window.addEventListener('resize', function(e){ResizeNodes();}, false);

function MakeNodesClickable() {
	var NodeList = document.getElementsByClassName('Clickable');
	for (var i=0; i<NodeList.length; i++) {
		NodeList[i].addEventListener('click', function(e){ChangeMain(Contents, e.target.id, false, false, true);}, false);
	}
	var AddElement = document.getElementsByClassName('Add')[0];
	if(AddElement) AddElement.addEventListener('click', ClickedAdd, false);
}

function ClickedAdd(e) {
	var MainName = document.getElementsByClassName('Main')[0].id;
	ChangeMain(Contents, 'Adding');
	var ClickedAddButton = function(e) {
		Content = document.getElementById('AddInput').value;
		if (!Content) { alert('Input Content!'); return; }
		
		AddChildNode(Contents, MainName, Content);
		ChangeMain(Contents, MainName, false, false, true);
	};
	var ClickedBackButton = function(e) {
		ChangeMain(Contents, MainName, false, false, true);
	};
	document.getElementById('AddButton').addEventListener('click', ClickedAddButton, false);
	document.getElementById('BackButton').addEventListener('click', ClickedBackButton, false);
	console.log('hello');
}

// node-0(루트) 에는 none(맨처음랜덤페이지) 이 붙어있게 해야지.
// img alt 가 안 먹길래 해 둔 <obejct><p></p></object> 를 img.onError 로 바꿔야겠다. 나중에 해야지.
// css - hover 내용 펼치기 (maxWidth -> width) 도 해야지.