import type * as yamlType from 'js-yaml';

// load from umd
declare const jsyaml: typeof yamlType
const yaml: typeof yamlType = jsyaml;

export class LayoutTag {
	constructor(
		public idFunc: (pageNum: number) => number,
		public startX: number,
		public startY: number,
		public size: number,
		public display: string) {
	}
}

const TagYamlType = new yaml.Type('!tag', {
	kind: 'sequence',

	// Loader must check if the input object is suitable for this type.
	resolve: function (data) {
		return data !== null && (data.length === 4 || data.length == 5);
	},

	// If a node is resolved, use it to create a Point instance.
	construct: function (data) {
		let disaplay = (data.length == 5) ? data[4] : data[0].toString();
		let idFunc: (pageNum: number) => number;
		if (typeof data[0] === 'number') {
			idFunc = (_) => data[0];
		} else {
			idFunc = new Function("id", `return ${data[0]}`) as (pageNum: number) => number;
		}
		return new LayoutTag(idFunc, data[1], data[2], data[3], disaplay);
	},

	// Dumper must process instances of Point by rules of this YAML type.
	instanceOf: LayoutTag,

	// Dumper must represent Point objects as three-element sequence in YAML.
	represent: function (tag) {
		if (tag instanceof LayoutTag) {
			return [tag.idFunc, tag.startX, tag.startY, tag.display];
		}
	}
});

export class LayoutCircle {
	constructor(
		public startX: number,
		public startY: number,
		public size: number) {
	}
}

const CircleYamlType = new yaml.Type('!circle', {
	kind: 'sequence',

	// Loader must check if the input object is suitable for this type.
	resolve: function (data) {
		return data !== null && (data.length === 3);
	},

	// If a node is resolved, use it to create a Point instance.
	construct: function (data) {
		return new LayoutCircle(data[0], data[1], data[2]);
	},

	// Dumper must process instances of Point by rules of this YAML type.
	instanceOf: LayoutCircle
});

export class LayoutDrillMark {
	constructor(
		public startX: number,
		public startY: number,
		public size: number) {
	}
}

const DrillMarkYamlType = new yaml.Type('!mark', {
	kind: 'sequence',

	// Loader must check if the input object is suitable for this type.
	resolve: function (data) {
		return data !== null && (data.length === 3);
	},

	// If a node is resolved, use it to create a Point instance.
	construct: function (data) {
		return new LayoutDrillMark(data[0], data[1], data[2]);
	},

	// Dumper must process instances of Point by rules of this YAML type.
	instanceOf: LayoutCircle
});


export class LayoutText {
	constructor(
		public textFunc: (pageNum: number) => string,
		public startX: number,
		public startY: number,
		public size: number,
		public rotate: number) {
	}
}

const LayoutTextYamlType = new yaml.Type('!text', {
	kind: 'sequence',

	// Loader must check if the input object is suitable for this type.
	resolve: function (data) {
		return data !== null && (data.length === 4 || data.length === 5);
	},

	// If a node is resolved, use it to create a Point instance.
	construct: function (data) {
		const textFunc = new Function("id", `return \`${data[0]}\``) as (pageNum: number) => string;
		const rotate = (data.length === 5) ? data[4] : 0;
		return new LayoutText(textFunc, data[1], data[2], data[3], rotate);
	},

	// Dumper must process instances of Point by rules of this YAML type.
	instanceOf: LayoutCircle
});

export class PageRange {
	public pages: number[] = [];
	constructor(public rawValue: string) {
		let fileds = rawValue.split(',');
		let reNumber = /^\s*(\d+)\s*$/;
		let reRange = /^\s*(\d+)\s*-\s*(\d+)\s*$/;
		for (let field of fileds) {
			if (reNumber.test(field)) {
				this.pages.push(+field);
				continue;
			}
			var result = reRange.exec(field)
			if (result) {
				let start = +result[1];
				let end = +result[2];
				for (let i = start; i <= end; ++i) {
					this.pages.push(i);
				}
				continue;
			}
			throw new Error(`can not parse range '${field}', '${rawValue}'`);
		}
	}
}

const RangeYamlType = new yaml.Type('!range', {
	kind: 'scalar',

	// Loader must check if the input object is suitable for this type.
	resolve: function (data) {
		return typeof data === 'string'
	},

	// If a node is resolved, use it to create a Point instance.
	construct: function (data) {
		return new PageRange(data);
	},

	// Dumper must process instances of Point by rules of this YAML type.
	instanceOf: PageRange,

	// Dumper must represent Point objects as three-element sequence in YAML.
	represent: function (tag) {
		throw new Error('not implemented')
	}
});

const schema = yaml.CORE_SCHEMA.extend([TagYamlType, RangeYamlType, CircleYamlType, DrillMarkYamlType, LayoutTextYamlType]);

export type LayoutEntry = LayoutTag | LayoutCircle | LayoutText | LayoutDrillMark;
export type InputData = {
	unit: number,
	dict: string,
	paperSize: [number, number],
	layout: LayoutEntry[]
	pages: number | PageRange
};

export function loadYaml(value: string): InputData {
	const doc = yaml.load(value, { schema });
	console.log('yaml load:', doc);
	return doc as InputData;
}

