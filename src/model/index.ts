class FeedTemplate {
    constructor() {
        this.addParam("keyword", ["AI"])
    }

    id: string = "";
    template: string = "https://rsshub.app/jinritoutiao/keyword/:keyword";
    params: Array<FeedParam> = [];

    addParam(name: string, values: [string]) {
        const param = new FeedParam(name);
        param.addValues(values);
        this.params.push(param)
    }
}

class FeedParam {
    constructor(name: string) {
        this.name = name;
    }

    name: string = "";
    values: [FeedParamValue] = [{value: ""}];

    addValues(values: [string]) {
        this.values.push(...values.map(it => new FeedParamValue(it)));
    }
}

class FeedParamValue {
    constructor(value: string) {
        this.value = value;
    }

    value: string = ""
}

class Feed {
    id: string;
    link: string;
    title: string;
}