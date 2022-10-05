class Node:
   def __init__(self, dataval=None):
      self.dataval = dataval
      self.nextval = None

class SLL:
   def __init__(self):
      self.headval = None
      
   def listprint(self):
       printval = self.headval
       while printval is not None:
           print(printval.dataval) #d2 sya nag pprint
           printval = printval.nextval
           
   def AtBegining(self,newdata):
       NewNode = Node(newdata)
       NewNode.nextval = self.headval
       self.headval = NewNode

   def AtEnd(self, newdata):
       NewNode = Node(newdata)
       if self.headval is None:
           self.headval = NewNode
           return
       lastel = self.headval
       while(lastel.nextval):
           lastel = lastel.nextval
       lastel.nextval=NewNode

   def InBet(self, mid_node, newdata):
       if mid_node is None:
           print("The node was not found")
           return
       NewNode = Node(newdata)
       NewNode.nextval = mid_node.nextval
       mid_node.nextval = NewNode
   
   def DelNode(self,Delkey):
       HeadVal = self.headval
       if HeadVal is not None:
           if HeadVal.dataval == Delkey:
               self.headval = HeadVal.next
               HeadVal = None
               return
       while(HeadVal is not None):
           if HeadVal.dataval == Delkey:
               break
           prev = HeadVal
           HeadVal = HeadVal.nextval
           
       if HeadVal == None:
           return
       
       prev.nextval = HeadVal.nextval
       HeadVal = None
       

list1 = SLL()
list1.AtBegining("One")
list1.AtBegining("Zero")
list1.AtBegining("Three")
list1.InBet(list1.headval.nextval,"Two")
list1.listprint()

print("=======================")
print("Linked List Element/s")
print("=======================")
print("Action")
print("  [a]Add Element")
print("  [d]Delete Element")
print("  [x]Exit")


list1.DelNode("Two") #remove element Two
print("___after remove____")
list1.listprint()