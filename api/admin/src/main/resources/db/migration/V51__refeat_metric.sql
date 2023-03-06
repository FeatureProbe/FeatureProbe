alter table event add type VARCHAR(64) after `name`;
alter table metric add denominator VARCHAR(1024) after `win_criteria`;

UPDATE event e SET type = (case when e.matcher is null then 'CUSTOM' when e.selector is not null then 'CLICK'  else 'PAGE_VIEW' end);
UPDATE metric SET type = 'CONVERSION';
UPDATE metric SET denominator = 'TOTAL_SAMPLE';
