/* eslint-env browser */
'use strict'

require('./style.css')
require('../node_modules/bootstrap/dist/js/bootstrap.min.js')
require('../node_modules/bootstrap/dist/css/bootstrap.min.css')

function division(myClass, text = '') {
	let element = document.createElement('div')
	if (text !== '')
		element.innerHTML = text
	element.classList.add(myClass)
	return element
}

let navBar = document.createElement('nav')
navBar.classList.add('navbar')
navBar.classList.add('navbar-inverse')
navBar.classList.add('bg-inverse')

let inputMenu = document.createElement('button')
inputMenu.classList.add('btn')
inputMenu.classList.add('btn-primary')
inputMenu.classList.add('dropdown-toggle')
inputMenu.type = 'button'
inputMenu.innerHTML = 'Inputs'

navBar.appendChild(inputMenu)

let myForm = document.createElement('input')
myForm.classList.add('form-control')
myForm.id = 'userInput'
myForm.style = 'width: 300px'
navBar.appendChild(myForm)

let submitFileButton = document.createElement('button')
submitFileButton.innerHTML = 'Submit Newick'
submitFileButton.type = 'button'
submitFileButton.classList.add('btn')
submitFileButton.classList.add('btn-success')
submitFileButton.addEventListener('click', submitNewick)

navBar.appendChild(submitFileButton)


document.body.appendChild(navBar)



let maindiv = document.body.appendChild(division('maindiv'))


//let	inputForm = maindiv.appendChild(division('fileInput', 'Input your tree as Newick text or upload a file:')),
let treeBox = document.createElement('div')
treeBox.id = 'treeBox'

maindiv.appendChild(treeBox)

let	d3 = require('d3'),
	tntTree = require('tnt.tree'),
	parser = require('tnt.newick')


let tree = tntTree()

let newick = ''
let treeCreated = false
let numCommas = 0
let expandedNode = tntTree.node_display.circle()
let collapsedNode = tntTree.node_display.triangle()

let node_display = tree.node_display()
			.size(3)
			.fill("black")
			.display (function (node) {
			if (node.is_collapsed()) {
				collapsedNode.display().call(this, node)
			} else {
				expandedNode.display().call(this, node)
			}
		})


function makeTree(newick) {
	numCommas = 0
	document.getElementById('treeBox').innerHTML = ''
	for (let x = 0; x < newick.length; x++) {
		if (newick.charAt(x) === ',')
			numCommas++
	}

	let fontSizeOfTreeLeafs = 12

	tree
		.data(parser.parse_newick(newick))
		.node_display(node_display)
		.label(tntTree.label
			.text()
			.fontsize(fontSizeOfTreeLeafs)
			.height(window.innerHeight*0.69/(numCommas+1))
		)
		.layout(tntTree.layout.vertical()
		.width(window.innerWidth*0.58)
		.scale(false)
			)
	tree(treeBox)
	}


function submitNewick ()
{
  let newick=document.getElementById("userInput").value
  makeTree(newick)
}

function resetPar() {
  numOpenPar=0
  numClosedPar=0
}

function submitFile() {
	document.getElementById("errorspot").innerHTML = ""
	let fileInput = document.getElementById("fileInput")
	console.log(fileInput.files[0])
	let newick = ''

	let file = fileInput.files[0]
	let reader = new FileReader()

	reader.onload = function(e) {
		newick = reader.result
		makeTree(newick)
	}
	reader.readAsText(file)
}

function updateVertical()
{
			tree.layout(tnt.tree.layout.vertical().width(window.innerWidth*0.58).scale(false))
			tree.update()
}

function updateRadial()
{
  {
			tree.layout(tnt.tree.layout.radial().width(Math.min(window.innerWidth*0.58, window.innerHeight*0.58)).scale(false))
			tree.update()
		}
}

 function download () {
		let pngExporter = tnt.utils.png()
			.filename("treeSample.png")
		pngExporter(d3.select("svg"))
	}

function fitscreen () {
  tree.node_display(node_display)
		.label (tnt.tree.label.text()
		.fontsize(12)
	 .height(window.innerHeight*0.69/(numCommas+1))
			)
 .layout(tnt.tree.layout.vertical().width(window.innerWidth*0.58).scale(false))
  tree.update()
}

tree.on ("click", function(node){
		node.toggle()
		tree.update()
	})