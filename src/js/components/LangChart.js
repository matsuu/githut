import React from 'react'
import axios from 'axios'
import { observer } from 'mobx-react'
import { update, first, range, includes, uniqBy, reject, flatten, map,
    split, take, zipWith, divide, unzip, sum, filter, drop } from 'lodash/fp'
import pr from '../../data/gh-pull-request.json'
import ReactHighcharts from 'react-highcharts'
import { LangChartStore } from '../stores/LangChartStore'
import { NonLangStore } from '../stores/NonLangStore'

@observer
export default class LangChart extends React.Component {

    constructor() {
        super()
        const store = new LangChartStore
        this.config = store.getConfig()
    }

    getTopLanguages(data) {
        const nonLang = new NonLangStore().getConfig()
        return data
            | map('name')
            | reject(includes(nonLang.lang))
            | take(10)
    }

    parseJSONData(data) {
        return data
            | split('\n')
            | map(JSON.parse)
            | map(update('count')(Math.floor))
    }

    categories() {
        return map(y =>
               map(q => y + "/Q" + q)(range(1, 5))
               )(range(12, 99))
            | flatten
            | drop(1)
    }

    percentageData(data) {
        const total = map(sum)(unzip(map('data')(data)))
        return map(update('data')(d => zipWith(divide)(d)(total)))(data)
    }

    createSeries(data) {
        const topLang = this.getTopLanguages(data)
        this.props.store.create(topLang)
        return data
            | filter(o => includes(o.name)(topLang))
            | map(d => ({
                name: d.name,
                data: map('count')(filter({'name': d.name})(data))
              }))
            | uniqBy('name')
    }

    async componentDidMount() {
        const {data} = await axios.get(pr)
        const chart = this.refs.chart.getChart()
        this.parseJSONData(data)
            | this.createSeries
            | this.percentageData
            | map(s => chart.addSeries(s, false))
        first(chart.xAxis).setCategories(this.categories())
        chart.redraw()
    }

    render() {
        return (<ReactHighcharts config={this.config} ref="chart"/>);
    }
}
