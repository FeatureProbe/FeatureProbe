package io.featureprobe.api.base.enums

import spock.lang.Specification

class SDKTypeSpec extends Specification {

    def "fromString() should throw an IllegalArgumentException for invalid input values"() {
        when:
        SDKType.fromString("Invalid")

        then:
        thrown(IllegalArgumentException)
    }

    def "fromString() should return the correct SDKType for valid input values"() {
        expect:
        SDKType.fromString("JAVA") == SDKType.Java
        SDKType.fromString(" PYTHON") == SDKType.Python
        SDKType.fromString("RUST ") == SDKType.Rust
        SDKType.fromString("Go") == SDKType.Go
        SDKType.fromString("Node") == SDKType.NodeJS
        SDKType.fromString("ANDROID") == SDKType.Android
        SDKType.fromString(" SWIFT ") == SDKType.Swift
        SDKType.fromString("objectiveC") == SDKType.ObjectiveC
        SDKType.fromString("JS") == SDKType.JavaScript
        SDKType.fromString("MINIPROGRAM") == SDKType.MiniProgram
        SDKType.fromString("React") == SDKType.React
    }
}
