#import <Foundation/Foundation.h>
#import <Security/Security.h>

// Narrow stdin/stdout bridge. No key, password or provider header is passed in argv.
// Production queries are limited to Fab's service; test builds use an isolated keychain.
int main(void) { @autoreleasepool {
  NSData *input = [[NSFileHandle fileHandleWithStandardInput] readDataOfLength:32769];
  if (input.length > 32768) return 2;
  NSDictionary *request = [NSJSONSerialization JSONObjectWithData:input options:0 error:nil];
  if (![request isKindOfClass:[NSDictionary class]]) return 2;
  NSString *operation = request[@"operation"];
  NSMutableDictionary *query = [@{(__bridge id)kSecClass: (__bridge id)kSecClassGenericPassword,
    (__bridge id)kSecAttrService: @"ai.fdlc.fab.byok.v1"} mutableCopy];
  SecKeychainRef keychain = NULL;
#ifdef FAB_KEYCHAIN_TEST
  NSString *keychainPath = request[@"keychainPath"];
  if (![keychainPath hasPrefix:@"/private/tmp/fab-keychain-test-"]) return 2;
  OSStatus opened;
  if ([operation isEqual:@"create"]) {
    const char *password = "non-secret-fixture-password";
    opened = SecKeychainCreate(keychainPath.fileSystemRepresentation, (UInt32)strlen(password), password, false, NULL, &keychain);
  } else opened = SecKeychainOpen(keychainPath.fileSystemRepresentation, &keychain);
  if (opened != errSecSuccess) return 3;
  query[(__bridge id)kSecMatchSearchList] = @[(__bridge id)keychain];
#endif
  BOOL listed = [operation isEqual:@"list"];
  NSString *account = request[@"account"];
  if (!listed && ![operation isEqual:@"create"] && ![operation isEqual:@"destroy"]) {
    if (![account isKindOfClass:[NSString class]] || account.length != 64) return 2;
    query[(__bridge id)kSecAttrAccount] = account;
  }
  OSStatus status = errSecParam; id value = [NSNull null];
  if ([operation isEqual:@"set"]) {
    NSString *secret = request[@"secret"];
    if (![secret isKindOfClass:[NSString class]] || secret.length < 12 || secret.length > 8192) return 2;
    NSData *metadata = [NSJSONSerialization dataWithJSONObject:request[@"reference"] options:0 error:nil];
    if (!metadata) return 2;
    NSDictionary *changes = @{(__bridge id)kSecValueData: [secret dataUsingEncoding:NSUTF8StringEncoding], (__bridge id)kSecAttrGeneric: metadata};
    status = SecItemUpdate((__bridge CFDictionaryRef)query, (__bridge CFDictionaryRef)changes);
    if (status == errSecItemNotFound) {
      [query addEntriesFromDictionary:changes];
#ifdef FAB_KEYCHAIN_TEST
      [query removeObjectForKey:(__bridge id)kSecMatchSearchList];
      query[(__bridge id)kSecUseKeychain] = (__bridge id)keychain;
#endif
      query[(__bridge id)kSecAttrLabel] = @"Fab user-enrolled model credential";
      status = SecItemAdd((__bridge CFDictionaryRef)query, NULL);
    }
  } else if ([operation isEqual:@"delete"]) {
    status = SecItemDelete((__bridge CFDictionaryRef)query);
  } else if (listed || [operation isEqual:@"get"] || [operation isEqual:@"has"]) {
    BOOL get = [operation isEqual:@"get"];
    query[(__bridge id)(get ? kSecReturnData : kSecReturnAttributes)] = @YES;
    query[(__bridge id)kSecMatchLimit] = (__bridge id)(listed ? kSecMatchLimitAll : kSecMatchLimitOne);
    CFTypeRef found = NULL;
    status = SecItemCopyMatching((__bridge CFDictionaryRef)query, &found);
    if (status == errSecSuccess) {
      id result = CFBridgingRelease(found);
      if (get) value = [[NSString alloc] initWithData:result encoding:NSUTF8StringEncoding] ?: [NSNull null];
      else if (listed) {
        NSMutableArray *metadata = [NSMutableArray array];
        for (NSDictionary *item in result) {
          NSData *data = item[(__bridge id)kSecAttrGeneric];
          id reference = data ? [NSJSONSerialization JSONObjectWithData:data options:0 error:nil] : nil;
          if (reference) [metadata addObject:reference];
        }
        value = metadata;
      } else value = @YES;
    }
  }
#ifdef FAB_KEYCHAIN_TEST
  else if ([operation isEqual:@"create"]) status = errSecSuccess;
  else if ([operation isEqual:@"destroy"]) status = SecKeychainDelete(keychain);
  if (keychain) CFRelease(keychain);
#endif
  NSData *output = [NSJSONSerialization dataWithJSONObject:@{@"status": @(status), @"value": value} options:0 error:nil];
  [[NSFileHandle fileHandleWithStandardOutput] writeData:output];
  return 0;
} }
