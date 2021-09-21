const yaml = jsyaml;
export class LayoutTag {
    constructor(idFunc, startX, startY, size, display) {
        this.idFunc = idFunc;
        this.startX = startX;
        this.startY = startY;
        this.size = size;
        this.display = display;
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
        let idFunc;
        if (data[0] === -1) {
            idFunc = new Function("page", `return page.id`);
        }
        else if (typeof data[0] === 'number') {
            idFunc = (_) => data[0];
        }
        else {
            idFunc = new Function("page", `return \`${data[0]}\``);
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
    constructor(startX, startY, size) {
        this.startX = startX;
        this.startY = startY;
        this.size = size;
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
    constructor(startX, startY, size) {
        this.startX = startX;
        this.startY = startY;
        this.size = size;
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
    constructor(textFunc, startX, startY, size, rotate) {
        this.textFunc = textFunc;
        this.startX = startX;
        this.startY = startY;
        this.size = size;
        this.rotate = rotate;
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
        const textFunc = new Function("page", `return \`${data[0]}\``);
        const rotate = (data.length === 5) ? data[4] : 0;
        return new LayoutText(textFunc, data[1], data[2], data[3], rotate);
    },
    // Dumper must process instances of Point by rules of this YAML type.
    instanceOf: LayoutCircle
});
export class PageRange {
    constructor(rawValue) {
        this.rawValue = rawValue;
        this.pages = [];
        let fileds = rawValue.split(',');
        let reNumber = /^\s*(\d+)\s*$/;
        let reRange = /^\s*(\d+)\s*-\s*(\d+)\s*$/;
        for (let field of fileds) {
            if (reNumber.test(field)) {
                this.pages.push({
                    id: +field
                });
                continue;
            }
            var result = reRange.exec(field);
            if (result) {
                let start = +result[1];
                let end = +result[2];
                for (let i = start; i <= end; ++i) {
                    this.pages.push({ id: i });
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
        return typeof data === 'string';
    },
    // If a node is resolved, use it to create a Point instance.
    construct: function (data) {
        return new PageRange(data);
    },
    // Dumper must process instances of Point by rules of this YAML type.
    instanceOf: PageRange,
    // Dumper must represent Point objects as three-element sequence in YAML.
    represent: function (tag) {
        throw new Error('not implemented');
    }
});
const schema = yaml.CORE_SCHEMA.extend([TagYamlType, RangeYamlType, CircleYamlType, DrillMarkYamlType, LayoutTextYamlType]);
export function loadYaml(value) {
    const doc = yaml.load(value, { schema });
    console.log('yaml load:', doc);
    return doc;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXByaWx0YWctanN5YW1sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXByaWx0YWctanN5YW1sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE1BQU0sSUFBSSxHQUFvQixNQUFNLENBQUM7QUFNckMsTUFBTSxPQUFPLFNBQVM7SUFDckIsWUFDUSxNQUFzQyxFQUN0QyxNQUFjLEVBQ2QsTUFBYyxFQUNkLElBQVksRUFDWixPQUFlO1FBSmYsV0FBTSxHQUFOLE1BQU0sQ0FBZ0M7UUFDdEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osWUFBTyxHQUFQLE9BQU8sQ0FBUTtJQUN2QixDQUFDO0NBQ0Q7QUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0lBQ3pDLElBQUksRUFBRSxVQUFVO0lBRWhCLG1FQUFtRTtJQUNuRSxPQUFPLEVBQUUsVUFBVSxJQUFJO1FBQ3RCLE9BQU8sSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELDREQUE0RDtJQUM1RCxTQUFTLEVBQUUsVUFBVSxJQUFJO1FBQ3hCLElBQUksUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDakUsSUFBSSxNQUFzQyxDQUFDO1FBQzNDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ25CLE1BQU0sR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENB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