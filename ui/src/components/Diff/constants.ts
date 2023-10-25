export type diffType = 'remove' | 'modify' | 'add' | 'same';
export type positionType = 'before' | 'after';

export const rulesI18NMap = new Map([
    ['string', 'targeting.rule.operator.type.string'],
    ['number', 'targeting.rule.operator.type.number'],
    ['datetime', 'targeting.rule.operator.type.datetime'],
    ['semver', 'targeting.rule.operator.type.semver'],
    ['segment', 'targeting.rule.operator.type.segment'],
    ['is one of', 'targeting.rule.condition.isoneof'],
    ['is not any of', 'targeting.rule.condition.notanyof'],
    ['starts with', 'targeting.rule.condition.startswith'],
    ['does not start with', 'targeting.rule.condition.notstartwith'],
    ['ends with', 'targeting.rule.condition.endswidth'],
    ['does not end with', 'targeting.rule.condition.notendwith'],
    ['contains', 'targeting.rule.condition.contains'],
    ['does not contain', 'targeting.rule.condition.notcontain'],
    ['matches regex', 'targeting.rule.condition.matches'],
    ['does not match regex', 'targeting.rule.condition.notmatch'],
    ['before', 'targeting.rule.subject.datetime.before'],
    ['after', 'targeting.rule.subject.datetime.after'],
    ['is in', 'targeting.rule.subject.segment.in'],
    ['is not in', 'targeting.rule.subject.segment.notin'],
    ['between', 'targeting.rule.condition.between']
]);
