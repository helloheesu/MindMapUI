// 기존 keyword 와 겹치지 않게 하려고 모든 변수명, 함수명 을 대문자로 시작하게(+CamelCase 은 cpp 습관 때문에 헣헣) 했습니다.



// Color Palette from : http://www.colourlovers.com/palette/92095/Giant_Goldfish
ColorList = ["#F38630", "#69D2E7", "#E0E4CC", "#FA6900", "#A7DBD8"];



////////////////// Adding Nodes to Array //////////////////

///// DB가 없으므로 전역변수 .... 헣헣 /////
Contents = {'NodeCnt':0};
Contents['None'] = {'Content':'', 'Depth':0, 'Parent':null, 'Child':[]}
Contents['Node0'] = {'Content':'Home', 'Depth':0, 'Parent':null, 'Child':[]};

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
AddChildNode(Contents, 'Node0', "hweofhqwobvncowabndasfwergvqergvq3wrvfvco;wqbnao;vcbnwobnvco;qwbncovj;weq");
AddChildNode(Contents, 'Node0', "qhwoefbqwo;bvo;qwabsvcj;asndv;nql;nqo;w");
AddChildNode(Contents, 'Node0');
AddChildNode(Contents, 'Node0-1');
AddChildNode(Contents, 'Node0-1', "adofchqwonvcoqw;nvo;qwnfqc[owinefoqw;c");
AddChildNode(Contents, 'Node0-1', "");
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

function ChangeMain(NodeObj, MainName, ChildNameArray) {
	document.getElementById('wrap').innerHTML = "";
	if (!MainName) { console.log("ChangeMain : No MainName Input"); return; }
	if (typeof NodeObj[MainName] === "undefined") { console.log("ChangeMain : MainName undefined"); return; }

	console.log("Creating Main");
	var MainElement = GetNewNodeElement(NodeObj, MainName, 'Main', ColorList);
	document.getElementById('wrap').appendChild(MainElement);

	if (!ChildNameArray) ChildNameArray = NodeObj[MainName].Child;

	var ChildElementArray = [];
	for (var i = 0; i < ChildNameArray.length; i++) {
		console.log("Creating Child "+i);
		ChildElementArray[i] = GetNewNodeElement(NodeObj, ChildNameArray[i], 'Child', ColorList);
		document.getElementById('wrap').appendChild(ChildElementArray[i]);
	}

	// 부모 노드를 배열의 맨 앞에 넣는다.
	if (NodeObj[MainName].Parent) {
		ChildElementArray.unshift(GetNewNodeElement(NodeObj, NodeObj[MainName].Parent, 'Parent', ColorList));
		document.getElementById('wrap').appendChild(ChildElementArray[0]);
	}

	var LongerWidth = (document.getElementsByClassName('Main')[0].offsetWidth > document.getElementsByClassName('Main')[0].offsetHeight) ? document.getElementsByClassName('Main')[0].offsetWidth : document.getElementsByClassName('Main')[0].offsetHeight;
	MakeCircle(ChildElementArray, LongerWidth*0.5);
}

function GetNewNodeElement(NodeObj, Name, ClassType, ColorArray) {
	var Element = document.createElement('div');
	Element.id = Name;
	Element.className = 'Node ';
	if (ClassType) Element.className += ClassType+' ';
	Element.innerHTML = NodeObj[Name].Content;
	if (ColorArray) Element.style.backgroundColor = ColorArray[NodeObj[Name].Depth % ColorArray.length];
	console.log(Element);
	// appendChild 도 공통된 행위라 GetNewNodeElement 에 묶을까 했으나, 받아서 직접 넣는 게 사용자 입장에서 맞는 것 같아서 일부러 뺌. 마치 new 로 받아오면 AddChild 는 직접 해 줘야 하듯이 헣헣
	// document.getElementById('wrap').appendChild(Element);
	return Element;
}

// referenced : http://hugogiraudel.com/2013/04/02/items-on-circle/
///// 개선 필요 .. 반지름이 미묘하게 안 맞음 ㅜㅜ 노드가 여러개일 땐 별로 티가 안 나는데, 3개 정도일 때 치명적 ㅜㅜ /////
function MakeCircle(ElementArray, ParentRadius, MarginRadius) {
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
	
	var NameArray = []
	for (name in NodeObj) {
		NameArray.push(name);
	}

	if (!ExcludeArray) return ShuffleArray(NameArray).splice(0, howMany);

	////// Excluding Elements /////
	// howMany 값이 너무 큰지 조사하고 로그 출력. 하지만 종료시키진 않음. 돌아가긴 한다, 기대한 것보다 적은 개수가 반환될 수 있긴 하지만.
	if (NameArray.length - ExcludeArray.length < howMany) { console.log("GetRandomNodeNameArray : howMany is too large."); }

	NameArray = ShuffleArray(NameArray);

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
function ShuffleArray(sourceArray) {
    for (var n = 0; n < sourceArray.length - 1; n++) {
        var k = n + Math.floor(Math.random() * (sourceArray.length - n));

        var temp = sourceArray[k];
        sourceArray[k] = sourceArray[n];
        sourceArray[n] = temp;
    }
    return sourceArray;
}

function Init(n, NodeObj, main) {
	if (!NodeObj) NodeObj = Contents;
	if (!n) {n = 7;}
	if (!main) main = 'None';
	if (NodeObj['NodeCnt'] < n) n = NodeObj['NodeCnt'];

	var ExcludeNodeNameArray = ['NodeCnt', 'None'];
	if (main && ExcludeNodeNameArray.indexOf(main) == -1) ExcludeNodeNameArray.push(main);
	console.log('Will Exclude : ');
	console.log(ExcludeNodeNameArray);

	var ChildNodeNameArray = GetRandomNodeNameArray(NodeObj, n, ExcludeNodeNameArray);
	console.log('Initial Display : ');
	console.log(ChildNodeNameArray);
	ChangeMain(NodeObj, main, ChildNodeNameArray);

	var ChildNodes = document.getElementsByClassName('Child');
	for (var i = 0; i < ChildNodes.length; i++) {
		var RGB = document.defaultView.getComputedStyle(ChildNodes[i]).backgroundColor.match(/(\d+)/g);
		ChildNodes[i].style.backgroundColor = "rgba("+RGB[0]+","+RGB[1]+","+RGB[2]+","+0.2+")";
	};
}
