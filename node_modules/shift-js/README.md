Shift.js
========

Use the shift key to select a range of elements, such as checkboxes and radio buttons.

<img src="https://travis-ci.org/Wildhoney/Shift.js.png?branch=master" />
&nbsp;
<img src="https://badge.fury.io/js/shift-js.png" />

Mimics Gmail's checkbox filter where you hold down the shift key to select ranges.

**Install with npm:** `npm install shift-js`.
<br />
&hellip;We're on Bower as well: `bower install shift-js`.

Getting Started
--------

Shift requires the adding of an attribute to each checkbox to specify its group. With this you can specify unique groups for your collection of checkboxes &ndash; allowing you to have multiple checkbox collections per page.

```html
<input type="checkbox" data-shift-group="groupOne" />
<input type="checkbox" data-shift-group="groupOne" />
<input type="checkbox" data-shift-group="groupOne" />

<input type="checkbox" data-shift-group="groupTwo" />
<input type="checkbox" data-shift-group="groupTwo" />
<input type="checkbox" data-shift-group="groupTwo" />
```

Setting up two unique groups (`groupOne` and `groupTwo`) allows both to act independently of one another. If you intersperse the checkboxes then it tends to make more sense &ndash; because checkboxes of another group will be let well alone.

Once you've setup your DOM there is nothing else to do &ndash; Shift will setup the behaviour automatically!