import axios from 'axios'
import { computed, observable, action } from "mobx"
import pullRequests from '../../data/gh-pull-request.json'
import pushEvent from '../../data/gh-push-event.json'
import starEvent from '../../data/gh-star-event.json'
import issueEvent from '../../data/gh-issue-event.json'
import { mapValues, first, map, split } from 'lodash/fp'

export class EventStore {

  @observable data = {}
  @observable ready = false;
  @observable event = [
    {"Pull Requests": pullRequests},
    {"Pushes": pushEvent},
    {"Stars": starEvent},
    {"Issues": issueEvent}
  ]

  constructor() {
    this.fetchData(pullRequests)
  }

  @action async prev() {
    // const rotateLeft = a => a.unshift(a.pop())
  }

  @action async next() {
    const rotateRight = a => a.push(a.shift())
    rotateRight(this.event)
    this.event
      | first
      | mapValues(e => this.fetchData(e))
  }

  parseJSON(data) {
    return data
      | split('\n')
      | map(JSON.parse)
  }

  @action async fetchData(json) {
    const { data } = await axios.get(json)
    this.data = data | this.parseJSON
    this.ready = true
  }

  @computed get getData() {
    return this.data
  }

}

export default new EventStore
