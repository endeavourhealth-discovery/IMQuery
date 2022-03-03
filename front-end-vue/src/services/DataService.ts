
export default class DataService {

    // .json example
    public getData(filename: string): any {
        return fetch(`demo/${filename}`).then(res => res.json())
            .then(d => d.data);
    }

}
