package com.featureprobe.api.service

import com.featureprobe.api.base.model.*
import com.featureprobe.api.builder.ServerSegmentBuilder
import com.featureprobe.api.builder.ServerToggleBuilder
import com.featureprobe.api.dao.entity.Segment
import spock.lang.Specification

class ServerToggleBuilderSpec extends Specification {

    def "build boolean server toggles"() {
        when:
        def toggle = new ServerToggleBuilder().builder().key("toggle1")
                .disabled(true)
                .forClient(true)
                .returnType("boolean")
                .version(1000)
                .rules(new TargetingContent(
                        rules: [newSelectRule("rule1", 0,
                                [newStringCondition("city", ["1"]),
                                 newSegmentCondition(["test_segment"]),
                                 newDatetimeCondition("loginTime", ["2022-06-27T16:08:10+08:00"]),
                                 newNumberCondition("age", ["20.1"]),
                                 newSemVerCondition("version", ["1.1.1"])])],
                        disabledServe: newSelectServe(1),
                        defaultServe: newSplitServe([2000, 3000, 5000]),
                        variations: newVariations(["true", "false"])).toJson())
                .segments(["test_segment": new Segment(uniqueKey: "test_project\$test_segment")])
                .build()
        then:
        with(toggle) {
            "toggle1" == key
            !enabled
            forClient
            1000 == version
            1 == rules.size()
            [[[0, 2000]], [[2000, 5000]], [[5000, 10000]]] == defaultServe.split.distribution
            1 == disabledServe.select
            [true, false] == variations

            with(rules[0]) {
                5 == conditions.size()
            }

            with(rules[0].conditions[1]) {
                "test_project\$test_segment" == objects[0]
            }
            with(rules[0].conditions[2]) {
                "1656317290" == objects[0]
            }

        }
    }

    def "build number server toggles"() {
        when:
        def toggle = new ServerToggleBuilder().builder().key("toggle1")
                .returnType("number")
                .version(1000)
                .rules(new TargetingContent(
                        rules: [],
                        disabledServe: newSelectServe(1),
                        defaultServe: newSplitServe([5000, 5000]),
                        variations: newVariations(["1.14", "1000"])).toJson()).build()
        then:
        with(toggle) {
            "toggle1" == key
            1000 == version
            [[[0, 5000]], [[5000, 10000]]] == defaultServe.split.distribution
            0 == rules.size()
            [1.14, 1000] == variations
        }
    }

    def "build server segments"() {
        when:
        def segment = new ServerSegmentBuilder().builder()
                .uniqueId("test_project\$test_segment")
                .version(1000)
                .rules("[{\"conditions\":[{\"type\":\"string\",\"subject\":\"userId\",\"predicate\":\"starts with\"," +
                        "\"objects\":[\"test\"],\"segmentType\":false,\"numberType\":false,\"datetimeType\":false," +
                        "\"semVerType\":false},{\"type\":\"datetime\",\"subject\":\"TIME\",\"predicate\":\"before\"," +
                        "\"objects\":[\"2022-06-29T15:19:14+00:00\"],\"segmentType\":false,\"numberType\":false," +
                        "\"datetimeType\":true,\"semVerType\":false}],\"name\":\"rule01\",\"notEmptyConditions\":true}]")
                .build()
        then:
        with(segment) {
            "test_project\$test_segment" == uniqueId
            1000 == version
            1 == rules.size()
            with(rules[0]) {
                2 == conditions.size()
                with(conditions[0]) {
                    1 == objects.size()
                }
                with(conditions[1]) {
                    1 == objects.size()
                    "1656515954" == objects[0]
                }
            }
        }
    }

    def "build server toggles when default serve is null should be use disabled serve"() {
        when:
        def toggle = new ServerToggleBuilder().builder().key("toggle1")
                .returnType("boolean")
                .version(1000)
                .disabled(true)
                .rules(new TargetingContent(
                        rules: [],
                        defaultServe: new ServeValue(),
                        disabledServe: newSelectServe(1),
                        variations: newVariations(["true", "false"])).toJson()).build()
        then:
        with(toggle) {
            0 == rules.size()
            defaultServe != null
            1 == defaultServe.select
        }
    }


    def newSelectRule(name, select, conditions) {
        new ToggleRule(name: name, serve: new ServeValue(select: select), conditions: conditions)
    }

    def newSelectServe(select) {
        new ServeValue(select: select)
    }

    def newSplitServe(splits) {
        new ServeValue(split: splits)
    }


    def newVariations(values) {
        values.collect { v -> new Variation(value: v) }

    }

    def newStringCondition(subject, objects) {
        new ConditionValue(type: "string", subject: subject, predicate: "is one of", objects: objects)
    }

    def newSegmentCondition(objects) {
        new ConditionValue(type: "segment", predicate: "is in", objects: objects)
    }

    def newDatetimeCondition(subject, objects) {
        new ConditionValue(type: "datetime", subject: subject, predicate: "before", objects: objects)
    }

    def newNumberCondition(subject, objects) {
        new ConditionValue(type: "number", subject: subject, predicate: ">", objects: objects)
    }

    def newSemVerCondition(subject, objects) {
        new ConditionValue(type: "semver", subject: subject, predicate: ">", objects: objects)
    }

}
