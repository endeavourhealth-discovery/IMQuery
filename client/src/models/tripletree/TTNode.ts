
export default class  TTNode {

    protected predicates = new Map<string, any>();


    has(predicate: string): boolean {
        return this.predicates.has(predicate);
    }
    get(predicate: string): any {
        return this.predicates.get(predicate);
    }
    set(predicate: string, value?: any) {

        if (!value) {
            this.predicates.delete(predicate);

        } else if (this.has(predicate) && Array.isArray(this.get(predicate))) {
            const arr = this.predicates.get(predicate);
            this.predicates.set(predicate, [...arr, value]);
        } else {
            this.predicates.set(predicate, value);
        }

    }
}
