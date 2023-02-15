package com.featureprobe.api.base.util

import spock.lang.Specification

class ToggleContentLimitCheckerSpec extends Specification {

    def 'test targeting content is over limit size'() {

        expect:
        limited == ToggleContentLimitChecker.isOverLimitSize(content, size)

        where:
        limited | content   | size
        false   | "abc"     | 100
        true    | "abcdefg" | 3
        false   | ""        | 1
        false   | null      | 1
    }

}
