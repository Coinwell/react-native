import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { TouchableOpacity, SectionList, View, Text, StyleSheet } from 'react-native'
import { SwipeRow } from 'react-native-swipe-list-view'
import { IconButton } from 'react-native-paper'
import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native'

import { useStores, useTheme } from '../../store'
import { usePicSrc } from '../utils/picSrc'

export default function ContactList() {
  const navigation = useNavigation()
  const { ui, contacts } = useStores()
  const theme = useTheme()

  return useObserver(() => {
    const contactsToShow = contacts.contacts.filter(c => {
      if (!ui.contactsSearchTerm) return true
      return c.alias.toLowerCase().includes(ui.contactsSearchTerm.toLowerCase())
    })
    const contactsNotMe = contactsToShow.filter(c => c.id !== 1).sort((a, b) => (a.alias > b.alias ? 1 : -1))

    const contactsNotFromGroups = contactsNotMe.filter(c => !c.from_group)

    return (
      <View style={{ ...styles.container, backgroundColor: theme.bg }}>
        <SectionList
          style={styles.list}
          sections={grouper(contactsNotFromGroups)}
          keyExtractor={(item: { [k: string]: any }, index) => {
            return item.alias + index + item.photo_url
          }}
          renderItem={({ item }) => <Item contact={item} onPress={contact => navigation.navigate('Contact', { contact })} />}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ ...styles.section, backgroundColor: theme.main }}>
              <Text style={{ ...styles.sectionTitle, color: theme.title }}>{title}</Text>
            </View>
          )}
        />
      </View>
    )
  })
}

function Item({ contact, onPress }) {
  const { contacts } = useStores()
  const theme = useTheme()
  let uri = usePicSrc(contact)
  const hasImg = uri ? true : false

  // TODO : this is a emporary fix and will be removed
  uri = uri.replace('http', 'https')

  return (
    <SwipeRow disableRightSwipe={true} friction={100} rightOpenValue={-80} stopRightSwipe={-80}>
      <View style={styles.backSwipeRow}>
        <IconButton icon='trash-can-outline' color='white' size={25} onPress={() => contacts.deleteContact(contact.id)} style={{ marginRight: 20 }} />
      </View>
      <View style={{ ...styles.frontSwipeRow, backgroundColor: theme.bg }}>
        <TouchableOpacity style={styles.contactTouch} activeOpacity={0.5} onPress={() => onPress(contact)}>
          <View style={styles.avatar}>
            <FastImage source={hasImg ? { uri } : require('../../../android_assets/avatar.png')} style={{ width: 44, height: 44 }} resizeMode={FastImage.resizeMode.cover} />
          </View>
          <View style={styles.contactContent}>
            <Text style={{ ...styles.contactName, color: theme.text }}>{contact.alias}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SwipeRow>
  )
}

function grouper(data) {
  // takes "alias"
  const ret = []
  const groups = data.reduce((r, e) => {
    let title = e.alias[0]
    if (!r[title]) r[title] = { title, data: [e] }
    else r[title].data.push(e)
    return r
  }, {})
  Object.values(groups).forEach(g => {
    ret.push(g)
  })
  return ret
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1
  },
  section: {
    paddingLeft: 24,
    height: 35,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionTitle: {
    fontWeight: '600'
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 23,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    marginLeft: 18,
    borderWidth: 1,
    borderColor: '#eee'
  },
  contactTouch: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 80,
    alignItems: 'center'
  },
  contactContent: {
    flex: 1
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500'
  },
  backSwipeRow: {
    backgroundColor: '#DB5554',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  frontSwipeRow: {
    flex: 1,
    height: 80
  }
})
