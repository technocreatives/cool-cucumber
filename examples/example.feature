Feature: Example

  As a developer I can have fun

  Background:
    Given I have a calculator

  @ui
  Example: Printing a number
    Given x is 7
    When I add 1 to it
    Then x is 8
    And x is not 42

  Scenario Outline: Random math
    Given x is 1
    When I add <y>
    Then x is <result>

    Examples:
      | y | result |
      | 2 | 3      |

  Example: Data tables
    Given I have these buttons:
      | name | type     |
      | 1    | digit    |
      | 2    | digit    |
      | +    | operator |
