def bayes(mes, apr, spam, not_spam):
    is_spam = apr
    is_not_spam = 1 - apr

    for word in mes:
        is_spam *= spam[word]
        is_not_spam *= not_spam[word]
    print(is_spam, is_not_spam)
    print(is_spam / (is_spam + is_not_spam))

not_spam = dict()
spam = dict()
to_check = list()

n, m, k = map(int, input().split())

for i in range(n):
    message = input().split()
    for word in message:
        if word in not_spam:
            not_spam[word] += 1
        else:
            not_spam[word] = 1
        spam[word] = 0

for i in range(m):
    message = input().split()
    for word in message:
        if word in spam:
            spam[word] += 1
        else:
            spam[word] = 1

        if word not in not_spam:
            not_spam[word] = 0

for i in range(k):
    message = input().split()
    for word in message:
        if word not in spam:
            spam[word] = 0

        if word not in not_spam:
            not_spam[word] = 0

    to_check.append(message)

words_not_spam = sum(not_spam.values())
words_spam = sum(spam.values())
for word in spam:
    not_spam[word] = ((not_spam[word] ) / words_not_spam) if words_not_spam else 0
    spam[word] = ((spam[word] ) / words_spam) if words_spam else 0

aprior = m / (n + m)

for msg in to_check:
    bayes(msg, aprior, spam, not_spam)
