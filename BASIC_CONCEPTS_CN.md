# 基础概念

**功能开关（Toggle）**: 在 UI 中的动态配置，能根据用户的不同属性, 设置规则返回不同的值的配置，toggleKey 是 toggle 的唯一标识。

**用户（User）**: 用户是各种属性（如姓名，邮箱，地址，年龄，国家，城市等）的容器，需要开发者在 SDK 中通过 with 方法传入各种属性，初始化方法传入的 UserKey 是用户的唯一标识，用于百分比放量，其他属性用于规则判断。

**规则（Rule）**：动态判断返回值的逻辑配置，规则中可以根据用户的各种属性，设置不同的条件，一个规则中多个条件是交集， 一个开关可以配置多个规则 ，规则之间是并集，如 Rule 1:  city == 'Paris' then true, Rule 2: name == 'bob' and city == 'London' then true。

**求值（Evaluation）**：求值指通过规则中的动态配置，和用户中的各种属性进行逻辑判断，如果条件符合，则返回对应的结果

**Value 方法族**：用于通过 toggleKey 和 user 拿到对应配置的值，如果没有符合条件，则返回用户设置的默认值。如 boolValue, stringValue 方法。

**Detail 方法族**：类似 value 方法族，但是会返回更多的信息，用于调试，如 Reason 字段用于解释返回value的原因。如 boolDetail，stringDetail 方法
。
