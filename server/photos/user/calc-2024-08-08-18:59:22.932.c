#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>

void skipWhitespace(const char** expr) {
    while (isspace(**expr)) {
        (*expr)++;
    }
}

double evaluateNumber(const char** expr) {
    double num = 0.0;
    while (isdigit(**expr) || **expr == '.') {
        num = num * 10.0 + (**expr - '0');
        (*expr)++;
    }
    
    if (**expr == '/') {
        (*expr)++;
        double denominator = evaluateNumber(expr);
        if (denominator != 0) {
            return num / denominator;
        } else {
            fprintf(stderr, "Error: Division by zero\n");
            exit(EXIT_FAILURE);
        }
    }
    
    return num;
}

double evaluateSubExpression(const char** expr) {
    double result = 0.0;
    double current_num = 0.0;
    char operation = '+';
    
    while (**expr) {
        skipWhitespace(expr);
        
        if (isdigit(**expr)) {
            current_num = evaluateNumber(expr);
        } else if (**expr == '(') {
            (*expr)++; // Move past '('
            current_num = evaluateSubExpression(expr);
        } else if (**expr == '+' || **expr == '-' || **expr == '*' || **expr == '/') {
            if (operation == '+') {
                result += current_num;
            } else if (operation == '-') {
                result -= current_num;
            } else if (operation == '*') {
                result *= current_num;
            } else if (operation == '/') {
                if (current_num != 0.0) {
                    result /= current_num;
                } else {
                    fprintf(stderr, "Error: Division by zero\n");
                    exit(EXIT_FAILURE);
                }
            }
            operation = **expr;
            (*expr)++;
        } else if (**expr == ')') {
            (*expr)++; // Move past ')'
            break; // End of sub-expression
        } else {
            // Handle unexpected characters or syntax errors
            break;
        }
    }
    
    // Final operation with the last number in the sub-expression
    if (operation == '+') {
        result += current_num;
    } else if (operation == '-') {
        result -= current_num;
    } else if (operation == '*') {
        result *= current_num;
    } else if (operation == '/') {
        if (current_num != 0.0) {
            result /= current_num;
        } else {
            fprintf(stderr, "Error: Division by zero\n");
            exit(EXIT_FAILURE);
        }
    }
    
    return result;
}

double evaluateExpression(const char* expr) {
    return evaluateSubExpression(&expr);
}

int main() {
    printf("Please dont write expressions with spaces.\n");
    while (1) {
        char* expression;
        scanf("%s", &expression);

        printf("Result: %d\n", evaluateExpression(expression));
    }
}
