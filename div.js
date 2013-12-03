// 기존 keyword 와 겹치지 않게 하려고 모든 변수명, 함수명 을 대문자로 시작하게(+CamelCase 은 cpp 습관 때문에 헣헣) 했습니다.



// Color Palette from : http://www.colourlovers.com/palette/92095/Giant_Goldfish
ColorList = ["#F38630", "#69D2E7", "#E0E4CC", "#FA6900", "#A7DBD8"];



////////////////// Adding Nodes to Array //////////////////

Contents = {};
Contents['Node0'] = {'Content':'Home', 'Depth':0, 'Parent':null, 'Child':[]};

function AddChildNode(Parent, Content) {
	// 나중에 error 처리를 위해 (예외처리에 관한)if 문을 따로 둠. 일단은 console 창에서 찍는 걸로.
	if (!Parent) { console.log("AddChildNode : No Parent Input"); return; }
	if (typeof Contents[Parent] === "undefined") { console.log("AddChildNode : Parent undefined"); return; }
	Name = Parent+'-'+Contents[Parent].Child.length;

	var newNode = {};
	newNode.Content = (Content) ? Content : Name;
	newNode.Depth = Contents[Parent].Depth + 1;
	newNode.Parent = Parent;
	newNode.Child = [];

	console.log("Pushing "+Name+" to "+Parent);
	Contents[Parent].Child.push(Name);

	Contents[Name] = newNode;
}

// test 용으로 hard coding.
AddChildNode('Node0', "hweofhqwobvncowabndasfwergvqergvq3wrvfvco;wqbnao;vcbnwobnvco;qwbncovj;weq");
AddChildNode('Node0', "qhwoefbqwo;bvo;qwabsvcj;asndv;nql;nqo;w");
AddChildNode('Node0');
AddChildNode('Node0-1');
AddChildNode('Node0-1', "adofchqwonvcoqw;nvo;qwnfqc[owinefoqw;c");
AddChildNode('Node0-1', "");
AddChildNode('Node0-2');
AddChildNode('Node0-2');
AddChildNode('Node0-2');
AddChildNode('Node0-2');
AddChildNode('Node0-2');
AddChildNode('Node0-2-1');
AddChildNode('Node0-2-1');
AddChildNode('Node0-2-1');
AddChildNode('Node0-2-1');
AddChildNode('Node0-2-1');
AddChildNode('Node0-2-1');

console.log(Contents);



////////////////// Positioning Nodes to HTML //////////////////


///// 원으로 배치하려고 했으나..... 뭔가 반지름이 조금씩 안 맞음 ㅜㅜ /////

function MakeCircle(ElementArray, ParentRadius, MarginRadius) {
	console.log("Circle Start");
	for (var i=0; i<ElementArray.length; i++) {
		// += 이 안 됨 ㅜㅜ : Uncaught SyntaxError: Unexpected token += 

		var Degree = (270 + i * 360 / ElementArray.length) % 360;
		
		var Radius = ParentRadius;
		if (MarginRadius||MarginRadius===0) {
			Radius += MarginRadius;
		} else {
			Radius += ( ElementArray[i].offsetWidth > ElementArray[i].offsetHeight ) ? ElementArray[i].offsetWidth*0.5 : ElementArray[i].offsetHeight*0.5;
		}
		
		// var Radius = 150;
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


function ChangeMain(Name) {
	if (!Name) { console.log("ChangeMain : No Name Input"); return; }
	if (typeof Contents[Name] === "undefined") { console.log("ChangeMain : Name undefined"); return; }

	function NewNodeElement(Name, Type) {
		var Element = document.createElement('div');
		Element.id = Name;
		Element.className = 'Node ';
		Element.className += Type+' ';
		Element.innerHTML = Contents[Name].Content;
		Element.style.backgroundColor = ColorList[Contents[Name].Depth % 5];
		console.log(Element);
		// appendChild 도 공통된 행위라 NewNodeElement 에 묶을까 했으나, 받아서 직접 넣는 게 사용자 입장에서 맞는 것 같아서 일부러 뺌. 마치 new 로 받아오면 AddChild 는 직접 해 줘야 하듯이 헣헣
		// document.getElementById('wrap').appendChild(Element);
		return Element;
	}

	console.log("Creating Main");
	var MainElement = NewNodeElement(Name, 'Main');
	document.getElementById('wrap').appendChild(MainElement);

	var aChildElement = [];
	for (var i = 0; i < Contents[Name].Child.length; i++) {
		console.log("Creating Child "+i);
		aChildElement[i] = NewNodeElement(Contents[Name].Child[i], 'Child');
		document.getElementById('wrap').appendChild(aChildElement[i]);
	}

	if (Contents[Name].Parent) {
		console.log(aChildElement.length);
		aChildElement.unshift(NewNodeElement(Contents[Name].Parent, 'Parent'));
		document.getElementById('wrap').appendChild(aChildElement[0]);
		console.log(aChildElement.length);
	}

	var LongerWidth = (document.getElementsByClassName('Main')[0].offsetWidth > document.getElementsByClassName('Main')[0].offsetHeight) ? document.getElementsByClassName('Main')[0].offsetWidth : document.getElementsByClassName('Main')[0].offsetHeight;
	MakeCircle(aChildElement, LongerWidth*0.5);
	
}


