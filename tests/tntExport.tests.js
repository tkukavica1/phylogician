'use strict'

let expect = require('chai').expect,
	parser = require('tnt.newick'),
	tntTree = require('tnt.tree')

let utils = require('../src/utils.js'),
	tntExport = require('../src/tntExport.js')

describe('Test suit for tntExport.js', function() {
	describe('tntObject', function() {
		it('it returns a JSON object like the input from parse_newick', function() {
			let originalTree = '((C,D)1[1],(A,(B,X)3)2,E)R;',
				treeObj = parser.parse_newick(originalTree)

			let treeObjOriginal = JSON.parse(JSON.stringify(treeObj))

			let tree = tntTree()
			tree.data(treeObj)

			let sameTree = tntExport.tntObject(tree)
			expect(sameTree).eql(treeObjOriginal)
		})
	})
})
