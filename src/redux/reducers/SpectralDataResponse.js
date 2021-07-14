
/*
 *          If validation issue, returns { valid: false, message: "User-readable reason why invalid."}
 *          Otherwise, returns { valid: true, data: some-object } 
 **/

export default class SpectralDataResponse {
    constructor(argmap) {
        const valid = argmap.valid;
        const data = argmap.data;
        const message = argmap.message;

        this.message = message;
        this.data = data;
        this.valid = valid;

        if (typeof data === SpectralDataResponse) {
            this.valid = data.valid && valid;
            if (!data.valid) this.message = data.message;
            this.data = data.data;
        }
    }

    isValid = () => this.valid;
    getMessage = () => {
        if (this.isValid()) {
            console.warn('Asked for message of valid object.');
            return;
        }
        return this.message;
    };
    getData = () => {
        if (!this.isValid()) {
            console.warn('Asked for data of invalid object.');
            return;
        }
        return this.data;
    };
}
