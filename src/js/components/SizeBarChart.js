import React from 'react'
import axios from 'axios'
import { observer } from 'mobx-react'
import avgsize from '../../data/gh-avg-repo-size.json'
import ReactHighcharts from 'react-highcharts'
import { mapKeys, sortBy, filter, includes, update, take, map, split, first } from 'lodash/fp'

@observer
export default class SizeBarChart extends React.Component {

    constructor() {
        super()
        this.config = {
        credits: { enabled: false },
        chart: { type: 'column', backgroundColor: 'transparent' },
        title: { text: 'Average Repository Size' },
        xAxis: {
        categories: [],
        }
        }
    }

    topLanguagesReady() {
        return this.props.store.topLanguages.length >= 10
    }

    categories() {
    }

    async componentWillUpdate() {
        if (!this.topLanguagesReady())
            return

        const { data } = await axios.get(avgsize)
        const chart = this.refs.chart.getChart()
        const { getTopLanguages } = this.props.store
        const t = getTopLanguages.sort()
        const size = data
        | split('\n')
        | map(JSON.parse)
        | map(update('avg_kb_size_per_repo')(Math.floor))
        | filter(o => includes(o.lang)(t))
        | sortBy('lang')
        | map('avg_kb_size_per_repo')
        | take(10)
        console.log(size)
        // first(chart.xAxis).setCategories(this.categories())
        getTopLanguages.map( x => {
            if (x && this.config.xAxis.categories.length < 10) {
                this.config.xAxis.categories.push(x)
                const chart = this.refs.chart.getChart()
                first(chart.xAxis).setCategories(this.config.xAxis.categories.sort())
                // console.log(x)
                // console.log(this.config.xAxis.categories)
                chart.redraw()
            }
        } )
        chart.addSeries({ data: size }, false)
        chart.redraw()
    }

    render() {
        return this.topLanguagesReady() ?
        (<ReactHighcharts config={ this.config } ref="chart"/>) : null;
    }
}
