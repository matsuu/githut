import { computed, observable, action } from "mobx"

export class TopLangStore {
  @observable topLanguages = []


  @action create(value) {
    this.topLanguages = value
  }

  @computed get getTopLanguages() {
   return this.topLanguages
 }


}

export default new TopLangStore
