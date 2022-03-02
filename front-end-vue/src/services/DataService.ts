
export default class DataService {

    // .json example
    public getData(): any {
        return fetch('demo/dataset1.json').then(res => res.json())
            .then(d => d.data);
    }

}
